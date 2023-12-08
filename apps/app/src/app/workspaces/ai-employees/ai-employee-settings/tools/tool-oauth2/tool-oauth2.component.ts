import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { env } from 'apps/app/src/environments/environment';
import { ToolsService } from '../tools.service';

@Component({
  selector: 'cognum-tool-oauth2',
  template: `<div>Redirecting...</div>`
})
export class ToolOAuth2Component {

  constructor(
    private route: ActivatedRoute,
    private toolsService: ToolsService
  ) { }

  ngOnInit() {
    this.handleRedirect();
  }

  handleRedirect(): void {
    if (window.opener) {
      const params = this.route.snapshot.queryParamMap;
      if (params.has('code')) {
        const code = params.get('code');
        this.toolsService.code = code as string;
        (window.opener as Window).postMessage({ code }, env.app_url);
        window.close();
      }
    } else {
      console.error('Erro de autenticação: janela principal não encontrada.');
    }
  }

}
