import { WebBrowser } from "../../web-browser/web-browser";

export class LoginVerifyUseCase {

  constructor(
    private webBrowser: WebBrowser
  ) { }

  async execute(verificationCode: string) {
    // TODO
    // Verificar se está na página de verificação
    // Preencher o campo de verificação
    // Clicar no botão de verificação
    // Verificar se está logado
    // Retornar se está logado ou não
  }
}
