import { CreateIndexOptions } from '@pinecone-database/pinecone';

export const indexConfig: Omit<CreateIndexOptions, 'name'> = {
  dimension: +(process.env.PINECONE_INDEX_DIMENSION || 1536),
  metric: process.env.PINECONE_INDEX_METRIC || 'cosine',
  waitUntilReady: bool(process.env.PINECONE_INDEX_WAIT_UNTIL_READY) || true,
  pods: num(process.env.PINECONE_INDEX_PODS),
  podType: process.env.PINECONE_INDEX_POD_TYPE || undefined,
  replicas: num(process.env.PINECONE_INDEX_REPLICAS),
  suppressConflicts: bool(process.env.PINECONE_INDEX_SUPPRESS_CONFLICTS),
};

function bool(value: string) {
  if (!value) return undefined;
  return value === 'true';
}

function num(value: string) {
  if (!value) return undefined;
  return +value;
}
