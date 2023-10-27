import {
  CreateColReq,
  CreateCollectionReq,
  DataType,
} from '@zilliz/milvus2-sdk-node';
import { MilvusLibArgs } from 'langchain/vectorstores/milvus';

export const milvusConfig: MilvusLibArgs = {
  primaryField: 'id',
  textField: 'text',
  vectorField: 'vector',
  textFieldMaxLength: 255,
};

export const collectionConfig:
  | Omit<CreateColReq, 'collection_name'>
  | CreateCollectionReq = {
  dimension: 1536,
  enable_dynamic_field: true,
  fields: [
    {
      name: 'id',
      data_type: DataType.Int64,
      description: 'Item identifier',
      autoID: true,
      is_primary_key: true,
    },
    {
      name: 'text',
      description: 'Text field',
      data_type: DataType.VarChar,
      max_length: 1024,
    },
    {
      name: 'ownerDocumentId',
      data_type: DataType.VarChar,
      is_partition_key: true,
      max_length: 24,
      description: 'Parent document identifier',
    },
    {
      name: 'vector',
      data_type: DataType.FloatVector,
      dim: 1536,
      max_length: 1536,
      description: 'Vector field',
    },
    {
      name: 'loc',
      data_type: DataType.VarChar,
      max_length: 64,
      description: 'Json parent document localization info',
    },
    {
      name: 'updatedAt',
      data_type: DataType.VarChar,
      max_length: 24,
      description: 'Update time register',
    },
  ],
};
