import { HttpParams } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { ITool } from '@cognum/interfaces';
import { CoreApiService } from 'apps/app/src/app/services/apis/core-api.service';

@Injectable({
  providedIn: 'root'
})
export class ToolsService {
  toolSelected = new EventEmitter<{ tool: ITool, index: number }>();
  private windowRef!: Window;
  private messageHandler!: (event: MessageEvent) => void;

  constructor(
    private coreApiService: CoreApiService
  ) { }

  set code(code: string) {
    localStorage.setItem('code', code);
  }
  get code(): any {
    const code = localStorage.getItem('code')
    localStorage.removeItem('code');
    return code;
  }

  googleOAuth2(tool: ITool) {
    return new Promise((resolve, reject) => {
      if (!tool.scope) return reject(null);

      let params = new HttpParams();
      params = params.set('scope', tool.scope);
      this.coreApiService.get('oAuth2/google', {
        params,
        headers: {
          Accept: 'application/json',
        },
      }).subscribe(async (res: any) => {
        const { authUrl } = res;
        const code = await this.openOAuth2Window(authUrl);
        console.log(code);

        if (!code) return;

        let params = new HttpParams();
        params = params.set('code', code);
        this.coreApiService.get('oAuth2/google/callback', {
          params,
          headers: {
            Accept: 'application/json',
          },
        }).subscribe((res: any) => {
          resolve(res.accessToken)
        });
      });
    });
  }

  private openOAuth2Window(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const width = 600;
      const height = 600;
      const left = (screen.width - width) / 2;
      const top = (screen.height - height) / 2;

      const windowFeatures = `width=${width},height=${height},top=${top},left=${left},scrollbars=yes,status=yes,resizable=yes`;

      this.windowRef = window.open(url, 'AuthWindow', windowFeatures) as Window;
      const interval = setInterval(() => {
        const code = this.code;
        if (code) {
          clearInterval(interval);
          resolve(code);
        } else if (this.windowRef.closed) {
          clearInterval(interval);
          reject(new Error('Janela de autenticação fechada'));
        }
      }, 500);

      // if (this.windowRef) {
      //   this.messageHandler = this.createMessageHandler(resolve);
      //   this.windowRef.addEventListener('message', this.messageHandler, false);
      //   this.windowRef.onbeforeunload = () => {
      //     window.removeEventListener('message', this.messageHandler, false);
      //   };
      // } else {
      //   reject(new Error('Não foi possível abrir a janela de autenticação'));
      // }
    })
  }

  // createMessageHandler(resolve: any) {
  //   return (event: MessageEvent) => {
  //     console.log(event.data);
  //     const code = event.data?.code || this.code;
  //     if (event.origin === env.app_url && code) {
  //       resolve(code)
  //     }
  //   }
  // }

}
