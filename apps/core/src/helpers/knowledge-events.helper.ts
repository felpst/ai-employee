import { EventEmitter } from 'events';

const knowledgeOperationEventEmitter = new EventEmitter();

knowledgeOperationEventEmitter.on('create', (documento) => {
  console.log('Documento criado:', documento);
});

knowledgeOperationEventEmitter.on('update', (documento) => {
  console.log('Documento atualizado:', documento);
});

knowledgeOperationEventEmitter.on('delete', (documento) => {
  console.log('Documento deletado:', documento);
});

export default knowledgeOperationEventEmitter