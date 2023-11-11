import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { IChatRoom, IWorkspace } from '@cognum/interfaces';
import { firstValueFrom } from 'rxjs';
import { DialogComponent } from '../../../shared/dialog/dialog.component';
import { AIEmployeesService } from '../ai-employees.service';
import { ChatService } from './chat/chat.service';
import { ChatsService, ICategorizedChats } from './chats.service';

@Component({
  selector: 'cognum-chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.scss'],
})
export class ChatsComponent {
  selected: IChatRoom | null = null;
  workspace!: IWorkspace;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private chatsService: ChatsService,
    private chatService: ChatService,
    private aiEmployeesService: AIEmployeesService,
    private dialog: MatDialog
  ) {
    this.chatsService.categorizedChats = this.chatsService.categorizedList();
  }

  get categorizedChats(): ICategorizedChats {
    return this.chatsService.categorizedChats;
  }

  get categories(): ('today' | 'yesterday' | 'last7days' | 'older')[] {
    return Object.keys(this.categorizedChats) as ('today' | 'yesterday' | 'last7days' | 'older')[];
  }

  get selectedChat(): IChatRoom | undefined {
    return this.chatService.selectedChat;
  }

  async loadWorkspaceChats() {
    await firstValueFrom(this.chatsService.load(this.aiEmployeesService.aiEmployee));
    this.chatsService.categorizedChats = this.chatsService.categorizedList();
  }

  onNewChat() {
    const chat: Partial<IChatRoom> = {
      aiEmployee: this.aiEmployeesService.aiEmployee._id
    }

    this.chatsService.create(chat).subscribe({
      next: (newChat) => {
        this.loadWorkspaceChats()
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
              this.loadWorkspaceChats()
              this.router.navigate(['./'], { relativeTo: this.route });
            },
          });
        }
      });
  }
}
