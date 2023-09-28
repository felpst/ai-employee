import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { IChat, IWorkspace } from '@cognum/interfaces';
import { DialogComponent } from '../shared/dialog/dialog.component';
import { WorkspacesService } from '../workspaces/workspaces.service';
import { ChatsService } from './chats.service';

@Component({
  selector: 'cognum-chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.scss'],
})
export class ChatsComponent {
  selected: IChat | null = null;
  workspace!: IWorkspace;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private chatsService: ChatsService,
    private workspacesService: WorkspacesService,
    private dialog: MatDialog
  ) {
    this.route.params.subscribe((params) => {
      this.chatsService.chats.clear();
      this.getWorkspace(params['workspaceId']);
      this.getChats(params['workspaceId']);
    });
  }

  getWorkspace(workspaceId: string) {
    this.workspacesService
      .get(workspaceId)
      .subscribe((workspace) => (this.workspace = workspace));
  }

  getChats(workspaceId: string) {
    this.chatsService.getAllFromWorkspace(workspaceId).subscribe();
  }

  get selectedChat(): string | null {
    return this.chatsService.selectedChat;
  }

  get chats() {
    return Array.from(this.chatsService.chats.values()).sort(
      (a: IChat, b: IChat) => {
        return (
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
        );
      }
    );
  }

  onNewChat() {
    const { _id } = this.workspace;
    this.chatsService.create(_id).subscribe({
      next: (chat) => {
        this.getChats(_id);
        this.router.navigate(['/chats', _id, chat._id]);
      },
    });
  }

  onChat(chat: IChat) {
    const { _id } = chat;
    this.chatsService.selectedChat = _id;
    this.router.navigate(['chats', this.workspace._id, _id]);
  }

  onDelete(chat: IChat) {
    this.dialog
      .open(DialogComponent, {
        data: {
          title: 'Delete Chat',
          content: 'Are you sure you want to delete this chat?',
          confirmText: 'Delete',
        },
      })
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          this.chatsService.delete(chat).subscribe({
            next: () => {
              this.getChats(this.workspace._id);
              this.router.navigate(['/chats', this.workspace._id]);
            },
          });
        }
      });
  }
}
