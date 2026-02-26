import dotenv from "dotenv";
import { Memory } from 'mem0ai/oss';
import { QdrantClient } from '@qdrant/js-client-rest';

dotenv.config({ quiet: true });

const qdrantClient = new QdrantClient({
  url: process.env.QDRANT_URL,
  apiKey: process.env.QDRANT_API_KEY,
});

async function ensureUserIdIndex(userId, interviewId) {
  const collectionName = `user_memories_${userId}_${interviewId}`;
  
  try {
      await qdrantClient.createPayloadIndex(collectionName, {
          field_name: "userId",
          field_schema: { type: "keyword" }
      });
      await qdrantClient.createPayloadIndex(collectionName, {
          field_name: "interviewId",
          field_schema: { type: "keyword" }
      });
      console.log(`Index created for userId and interviewId in collection: ${collectionName}`);
  } catch (err) {
      if (err?.response?.status === 409) {
          console.log(`Index already exists for userId and interviewId in collection: ${collectionName}`);
      } else {
          console.error("Error creating index:", err);
          throw err;
      }
  }
}

export async function retriveRelevantMemory(userId, interviewId, search_param) {
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
    await ensureUserIdIndex(userId, interviewId);
    const relevantMemory = await memory.search(search_param, { userId, interviewId });
    return relevantMemory;
  }
  catch (error) {
    console.log(error)
    return { results: [] };
  }
}