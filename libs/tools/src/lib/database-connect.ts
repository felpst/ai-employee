import { OpenAI } from '@cognum/llm/openai';
import { SqlDatabaseChain } from 'langchain/chains/sql_db';
import { SqlDatabase } from 'langchain/sql_db';
import { DynamicTool } from 'langchain/tools';
import { DataSource } from 'typeorm';

export class DatabaseConnect extends DynamicTool {
  constructor() {
    super({
      name: 'Database Connect',
      description: `Use to connect to a database and perform queries. An input must be a question.`,
      // TODO: Search connection parameters from the company's knowledge base
      func: async (input: string) => {
        console.log('------------Database Connect------------');
        const datasource = new DataSource({
          type: 'mysql',
          host: 'localhost',
          username: 'root',
          password: 'root',
          database: 'ecommerce',
        });

        const db = await SqlDatabase.fromDataSourceParams({
          appDataSource: datasource,
          includesTables: ['usuario', 'disciplina', 'plano_curso'],
        });

        const chain = new SqlDatabaseChain({
          llm: new OpenAI({
            temperature: 0,
            verbose: true,
          }),
          database: db,
        });

        const result = await chain.run(input);
        console.log(`Got output ${result}`);
        console.log('------------Database Connect------------');
        return result;
      },
      verbose: true,
    });
  }
}
