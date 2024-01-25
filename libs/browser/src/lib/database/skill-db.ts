import { MongoDBAtlasVectorSearch } from "@langchain/community/vectorstores/mongodb_atlas";
import { EmbeddingsModel } from '@cognum/llm';
import { MongoClient } from "mongodb";
import { Skill } from '../browser.interfaces';
import { Document } from 'langchain/document';


export default class SkillVectorDB extends MongoDBAtlasVectorSearch {
  constructor() {
    const client = new MongoClient(process.env.MONGO_URL);
    const dbName = process.env.PROD === 'true' ? 'production' : 'test';
    const collection = client.db(dbName).collection('skills');

    super(new EmbeddingsModel(), {
      collection,
      textKey: "description",
      embeddingKey: "embeddings"
    });
  }

  async addSkill(skill: Skill) {
    return this.addDocuments([
      new Document({
        pageContent: `${skill.name} - ${skill.description}`,
        metadata: { skill }
      })
    ]);
  }
}