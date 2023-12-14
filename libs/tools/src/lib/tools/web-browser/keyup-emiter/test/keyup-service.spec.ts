import { KeyUpService } from '../keyup-emiter.service';

describe('Key up service', () => {
  it('press', async () => {
    const service = new KeyUpService();
    const result = await service.press('@10');
    expect(result).toBe('Key @10 pressed');
  })

  it('press combination', async () => {
    const service = new KeyUpService();
    const result = await service.press('@66', ['@65']);
    expect(result).toBe('Keys @65,@66 pressed');
  })

  it('typeMessage', async () => {
    const service = new KeyUpService();
    const result = await service.typeMessage('Hello');
    expect(result).toBe('Text Hello typed');
  })
})