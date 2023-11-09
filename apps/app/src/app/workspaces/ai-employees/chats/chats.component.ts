import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { IChatRoom, IWorkspace } from '@cognum/interfaces';
import { firstValueFrom } from 'rxjs';
import { DialogComponent } from '../../../shared/dialog/dialog.component';
import { WorkspacesService } from '../../workspaces.service';
import { AIEmployeesService } from '../ai-employees.service';
import { ChatService } from './chat/chat.service';
import { ChatsService, ICategorizedChats } from './chats.service';

@Component({
  selector: 'cognum-chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.scss'],
})
export class ChatsComponent {
  categorizedChats: ICategorizedChats;


  selected: IChatRoom | null = null;
  workspace!: IWorkspace;
  // categorizedChats: {
  //   last24h: IChatRoom[], yesterday: IChatRoom[], last7days: IChatRoom[] , older: IChatRoom[]
  // } = {
  //   last24h: [], yesterday: [], last7days: [], older: []
  // };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private chatsService: ChatsService,
    private chatService: ChatService,
    private workspacesService: WorkspacesService,
    private aiEmployeesService: AIEmployeesService,
    private dialog: MatDialog
  ) {
    this.categorizedChats = this.chatsService.categorizedList();
  }

  get categories(): ('today' | 'yesterday' | 'last7days' | 'older')[] {
    return Object.keys(this.categorizedChats) as ('today' | 'yesterday' | 'last7days' | 'older')[];
  }

  get selectedChat(): IChatRoom | undefined {
    return this.chatService.selectedChat;
  }

  get chats() {
    return Array.from(this.chatsService.chats.values()).sort(
      (a: IChatRoom, b: IChatRoom) => {
        return (
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
        );
      }
    );
  }

  async reloadWorkspaceChats() {
    await firstValueFrom(this.chatsService.load(this.aiEmployeesService.aiEmployee));
    this.categorizedChats = this.chatsService.categorizedList();
  }

  onNewChat() {
    const chat: Partial<IChatRoom> = {
      aiEmployee: this.aiEmployeesService.aiEmployee._id
    }

    this.chatsService.create(chat).subscribe({
      next: (newChat) => {
        this.reloadWorkspaceChats()
        this.router.navigate([newChat._id], { relativeTo: this.route });
      },
    });
  }

  onChat(chat: IChatRoom) {
    this.router.navigate([`/workspaces/${this.workspace._id}/chats/${chat.id}`]);
  }

  onDelete(chat: IChatRoom) {
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
              this.reloadWorkspaceChats()
              this.router.navigate(['./'], { relativeTo: this.route });
            },
          });
        }
      });
  }
}
