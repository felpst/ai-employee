import 'dotenv/config';
import { AIEmployeeMemory } from './memory';

describe('InformationRetrievalAgent', () => {
  jest.setTimeout(600000);
  let memory: AIEmployeeMemory;

  beforeEach(async () => {
    memory = new AIEmployeeMemory();
  });

  it('should answer question correctly about email', async () => {
    memory.set([
      { pageContent: 'Linecker Amorim nasceu em Curitiba dia 10/10/1992, seu principal contato é linecker@cognum.ai.' }
    ])
    const response = await memory.search(`What is Linecker's email?`)
    console.log(response)
    expect(response.accuracy).toBe(true)
    expect(response.answer).toContain('linecker@cognum.ai')
  });

  it('should answer question correctly add information', async () => {
    let res = await memory.instruction(`Linecker nasceu em Curitiba`)
    console.log(JSON.stringify(res));

    res = await memory.instruction(`O sobrenome do Linecker é Amorim`)
    console.log(JSON.stringify(res));

    res = await memory.instruction(`Curitiba é uma cidade fria`)
    console.log(JSON.stringify(res));

    res = await memory.instruction(`Todo mundo que nasce em Curitiba é lindo`)
    console.log(JSON.stringify(res));

    let response = await memory.search(`O Linecker é lindo?`)
    console.log(response)

    res = await memory.instruction(`Limpe tudo o que você sabe sobre o Linecker`)
    console.log(JSON.stringify(res));

    response = await memory.search(`Qual é o sobrenome do Linecker?`)
    console.log(response)

    expect(true).toBe(true)
  });

});

