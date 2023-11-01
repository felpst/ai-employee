import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { IChat, IWorkspace } from '@cognum/interfaces';
import { DialogComponent } from '../../shared/dialog/dialog.component';
import { WorkspacesService } from '../workspaces.service';
import { ChatsService } from './chats.service';

@Component({
  selector: 'cognum-chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.scss'],
})
export class ChatsComponent {
  selected: IChat | null = null;
  workspace!: IWorkspace;
  categorizedChats: { 
    last24h: IChat[], yesterday: IChat[], last7days: IChat[] , older: IChat[]
  } = { 
    last24h: [], yesterday: [], last7days: [], older: [] 
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private chatsService: ChatsService,
    private workspacesService: WorkspacesService,
    private dialog: MatDialog
  ) {
    this.route.params.subscribe((params) => {
      const workspaceId = params['id'];
      this.chatsService.chats.clear();
      this.getWorkspace(workspaceId);
      this.getChats(workspaceId);
    });
  }

  getWorkspace(workspaceId: string) {
    this.workspacesService
      .get(workspaceId)
      .subscribe((workspace) => (this.workspace = workspace));
  }

  getChats(workspaceId: string) {
    this.chatsService.getAllFromWorkspace(workspaceId).subscribe((chatsMap: Map<string, IChat>) => {
      const chatsArray: IChat[] = Array.from(chatsMap.values());
      this.categorizedChats = this.categorizeChats(chatsArray);
    });
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
  
  // Categorize chats by creation date
  categorizeChats(chats: IChat[]): { last24h: IChat[], yesterday: IChat[], last7days: IChat[], older: IChat[] } {
    const now = new Date();
    const last24h: IChat[] = [];
    const yesterday: IChat[] = [];
    const last7days: IChat[] = [];
    const older: IChat[] = [];
    
    chats.forEach((chat) => {
      const createdAt = new Date(chat.createdAt!);

      const timeDiff = now.getTime() - createdAt.getTime();
      const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));

      if (daysDiff === 0) {
        last24h.push(chat);
      } else if (daysDiff === 1) {
        yesterday.push(chat);
      } else if (daysDiff <= 7) {
        last7days.push(chat);
      } else {
        older.push(chat);
      }
    });

    return { last24h, yesterday, last7days, older };
  }

  onNewChat() {
    const { id } = this.route.snapshot.params; 
    this.chatsService.create(id).subscribe({
      next: (chat) => {
        this.getChats(id);
        this.router.navigate(['/workspaces', id, 'chats', chat._id]);
      },
    });
  }

  onChat(chat: IChat) {
    console.log(chat)
    const { _id } = chat;
    console.log(_id)
    console.log(this.workspace._id)
    this.chatsService.selectedChat = _id;
    this.router.navigate([`/workspaces/${this.workspace._id}/chats/${_id}`]);
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
              this.router.navigate(['/workspaces', this.workspace._id, 'chats', 'overview']);
            },
          });
        }
      });
  }
}
