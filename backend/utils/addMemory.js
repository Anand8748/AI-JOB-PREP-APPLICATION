import dotenv from "dotenv";
import { Memory } from 'mem0ai/oss';
import { Queue, Worker } from 'bullmq';
import { QdrantClient } from "@qdrant/js-client-rest";

dotenv.config({ quiet: true });

const redisConfig = {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
    retryDelayOnFailover: 100,
    enableReadyCheck: false,
    maxRetriesPerRequest: null,
};

const qdrantClient = new QdrantClient({
    url: process.env.QDRANT_URL,
    apiKey: process.env.QDRANT_API_KEY,
});

// Create memory processing queue
const memoryQueue = new Queue('memory-processing', {
    connection: redisConfig,
    defaultJobOptions: {
        attempts: 3,
        backoff: {
            type: 'exponential',
            delay: 2000,
        },
        removeOnComplete: 100, // Keep last 100 completed jobs
        removeOnFail: 50,      // Keep last 50 failed jobs
    },
});

async function ensureCollectionAndIndexes(userId, interviewId) {
    const collectionName = `user_memories_${userId}_${interviewId}`;

    // 1️⃣ Check if collection exists
    const { collections } = await qdrantClient.getCollections();
    const exists = collections.some(c => c.name === collectionName);

    // 2️⃣ Create collection FIRST
    if (!exists) {
        console.log(`📦 Creating collection: ${collectionName}`);

        await qdrantClient.createCollection(collectionName, {
            vectors: {
                size: 1536,              // ✅ MUST match embeddingDims
                distance: "Cosine",
            },
        });

        console.log("✅ Collection created");
    }

    // 3️⃣ Create payload index AFTER collection exists
    try {
        await qdrantClient.createPayloadIndex(collectionName, {
            field_name: "userId",
            field_schema: "keyword",
        });
        await qdrantClient.createPayloadIndex(collectionName, {
            field_name: "interviewId",
            field_schema: "keyword",
        });
        console.log("✅ Index created for userId and interviewId");
    } catch (err) {
        if (err?.response?.status === 409) {
            console.log("ℹ️ Index already exists");
        } else {
            throw err;
        }
    }
}


// Worker to process memory jobs
const memoryWorker = new Worker('memory-processing', async (job) => {
    const { userId, message } = job.data;
    try {
        await processMemoryJob(userId, message);
        return { success: true, userId, processedAt: new Date().toISOString() };
    } catch (error) {
        console.error(`❌ Failed to process memory for user ${userId}:`, error);
        throw error;
    }
}, {
    connection: redisConfig,
    concurrency: 5, // Process up to 5 jobs concurrently
});

// Memory processing logic
async function processMemoryJob(userId, interviewId, message) {
    await ensureCollectionAndIndexes(userId, interviewId);
    const config = {
        version: 'v1.1',
        embedder: {
            provider: 'openai',
            config: {
                apiKey: process.env.OPENAI_API_KEY,
                model: 'text-embedding-3-small',
                embeddingDims: 1536,
            },
        },
        vectorStore: {
            provider: 'qdrant',
            config: {
                collectionName: `user_memories_${userId}_${interviewId}`,
                url: process.env.QDRANT_URL,
                apiKey: process.env.QDRANT_API_KEY,
                embeddingModelDims: 1536,
                dimension: 1536,
            },
        },
        llm: {
            provider: 'openai',
            config: {
                apiKey: process.env.OPENAI_API_KEY,
                model: 'gpt-4o-mini',
            },
        },
    };

    const memory = new Memory(config);
    await memory.add(message, { userId, interviewId, metadata: { category: "memory" } });
}

// Event listeners for monitoring
memoryWorker.on('completed', (job, result) => {
    console.log(`🎉 Job ${job.id} completed for user ${result.userId}`);
});

memoryWorker.on('failed', (job, err) => {
    console.log(`💥 Job ${job?.id} failed: ${err.message}`);
});

memoryWorker.on('error', (err) => {
    console.error('Worker error:', err);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
    await memoryWorker.close();
    await memoryQueue.close();
    process.exit(0);
});

// Simplified synchronous addMemory function for immediate storage
export async function addMemory(userId, interviewId, message) {
    try {
        // Ensure collection and indexes exist
        await ensureCollectionAndIndexes(userId, interviewId);
        
        const config = {
            version: 'v1.1',
            embedder: {
                provider: 'openai',
                config: {
                    apiKey: process.env.OPENAI_API_KEY,
                    model: 'text-embedding-3-small',
                    embeddingDims: 1536,
                },
            },
            vectorStore: {
                provider: 'qdrant',
                config: {
                    collectionName: `user_memories_${userId}_${interviewId}`,
                    url: process.env.QDRANT_URL,
                    apiKey: process.env.QDRANT_API_KEY,
                    embeddingModelDims: 1536,
                    dimension: 1536,
                },
            },
            llm: {
                provider: 'openai',
                config: {
                    apiKey: process.env.OPENAI_API_KEY,
                    model: 'gpt-4o-mini',
                },
            },
        };
        const memory = new Memory(config);

        // Add memory immediately with correct format
        await memory.add(message, { userId, interviewId, metadata: { category: "memory" } });

        console.log(`✅ Memory added immediately for user: ${userId}, interview: ${interviewId}`);
        return { success: true };
    } catch (error) {
        console.error('Failed to add memory:', error);
        throw error;
    }
}