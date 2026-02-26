import dotenv from "dotenv";
import { Memory } from 'mem0ai/oss';
import { QdrantClient } from "@qdrant/js-client-rest";

dotenv.config({ quiet: true });

const qdrantClient = new QdrantClient({
  url: process.env.QDRANT_URL,
  apiKey: process.env.QDRANT_API_KEY,
});

// Function to ensure required indexes exist
async function ensureIndexesForRetrieval(userId, interviewId) {
  const collectionName = `user_memories_${userId}_${interviewId}`;
  
  try {
      // Create userId and interviewId index if it doesn't exist
      await qdrantClient.createPayloadIndex(collectionName, {
          field_name: "userId",
          field_schema: { type: "keyword" }
      });
      await qdrantClient.createPayloadIndex(collectionName, {
          field_name: "interviewId",
          field_schema: { type: "keyword" }
      });
      console.log("Index created for userId and interviewId");
  } catch (err) {
      if (err?.response?.status === 409) {
          console.log("Index already exists for userId and interviewId");
      } else {
          console.error("❌ Error creating userId/interviewId index:", err);
          throw err;
      }
  }
}

export async function retriveAllMemory(userId, interviewId) {
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
  };
  const memory = new Memory(config);

  try {
    await ensureIndexesForRetrieval(userId, interviewId);
    const allMemories = await memory.getAll({ userId, interviewId });
    return allMemories;
  }
  catch (error) {
    console.log(error)
    return { results: [] }; // Return empty results instead of undefined
  }
}