import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { IChat } from '@cognum/interfaces';
import { Observable } from 'rxjs';
import { WorkspacesService } from '../../workspaces.service';
import { ChatsService } from './chats.service';

@Injectable({
  providedIn: 'root',
})
export class ChatsResolver {
  constructor(
    private workspacesService: WorkspacesService,
    private chatsService: ChatsService,
    private _router: Router
  ) {}

  resolve(): Observable<IChat[]> {
    const workspaceId = this.workspacesService.selectedWorkspace._id;

    return new Observable((observer) => {
      let params = new HttpParams();
      params = params.set('filter[workspace]', workspaceId);
      params = params.set('sort', '-createdAt');

      this.chatsService
        .list({ params })
        .subscribe({
          next: (chats) => {
            observer.next(chats);
          },
          error: (error) => {
            // TODO show error message to user
            this._router.navigate(['/']);
          },
        });
    });
  }
}
