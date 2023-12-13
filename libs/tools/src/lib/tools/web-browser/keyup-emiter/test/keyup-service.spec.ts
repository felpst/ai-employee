import { KeyUpService } from '../keyup-emiter.service';

describe('Key up service', () => {
  it('press', async () => {
    const service = new KeyUpService();
    const result = await service.press('Enter');
    expect(result).toBe('Key Enter pressed');
  })

  it('typeMessage', async () => {
    const service = new KeyUpService();
    const result = await service.typeMessage('Hello');
    expect(result).toBe('Text Hello typed');
  })
})