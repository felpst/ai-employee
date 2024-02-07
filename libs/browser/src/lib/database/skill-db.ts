import { MongoDBAtlasVectorSearch } from "@langchain/community/vectorstores/mongodb_atlas";
import { EmbeddingsModel } from '@cognum/llm';
import { Collection, MongoClient } from "mongodb";
import { Skill } from '../browser.interfaces';
import { Document } from '@langchain/core/documents';


export default class SkillVectorDB extends MongoDBAtlasVectorSearch {
  private _collection: Collection;
  constructor() {
    const client = new MongoClient(process.env.MONGO_URL);
    const dbName = process.env.PROD === 'true' ? 'production' : 'test';
    const collection = client.db(dbName).collection('skills');

    super(new EmbeddingsModel(), {
      collection,
      textKey: "description",
      embeddingKey: "embeddings"
    });
    this._collection = collection;
  }

  async addSkill(skill: Skill) {
    return this.addDocuments([
      new Document({
        pageContent: `${skill.name} - ${skill.description}`,
        metadata: { skill }
      })
    ]);
  }

  async getSkillByName(name: string) {
    return this._collection.findOne({
      $where: function () {
        return this.skill.name === name;
      }
    });
  }
}