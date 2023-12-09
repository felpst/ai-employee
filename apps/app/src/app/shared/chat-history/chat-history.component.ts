import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { IAIEmployee, IChatRoom, IUser } from '@cognum/interfaces';
import { ObjectId } from 'mongoose';
import { ChatsService } from '../../workspaces/ai-employees/chats/chats.service';
import { DialogComponent } from '../dialog/dialog.component';


@Component({
  selector: 'cognum-chat-history',
  templateUrl: './chat-history.component.html',
  styleUrls: ['./chat-history.component.scss'],
})
export class ChatHistoryComponent {

  history: any[] = [];

  @Output() chatDeleted = new EventEmitter<void>();
  @Input() set chats(chats: IChatRoom[]) {
    this.history = chats.map(chat => {
      let aiEmployeeName = '';
      if ((chat.aiEmployee as IAIEmployee).name) {
        aiEmployeeName = (chat.aiEmployee as IAIEmployee).name;
      }

      return {
        ...chat,
        users: [chat.createdBy, chat.aiEmployee],
        date: chat.updatedAt,
        createdAt: chat.createdAt,
        historyTitle: `${(chat.createdBy as unknown as IUser).name || ''} started a new conversation with ${aiEmployeeName}`,
        name: chat.name,
        summary: chat.summary
      };
    });
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private chatService: ChatsService,
    private dialog: MatDialog
  ) { }

  onChat(aiEmployee: ObjectId, chat: IChatRoom) {
    this.router.navigate(['../ai-employees', aiEmployee, 'chats', chat._id], { relativeTo: this.route });
  }

  deleteChat(chat: IChatRoom) {
    this.dialog
      .open(DialogComponent, {
        data: {
          title: 'Delete Chat ',
          content: 'Are you sure you want to delete this Chat?',
          confirmText: 'Delete',
        },
      })
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          this.chatService.delete(chat).subscribe(
            () => {
              this.chatDeleted.emit();
            },
            error => {
              console.error(error);
            }
          );
        }
      });
  }

  formatChatDate(date: Date): string {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - new Date(date).getTime()) / 1000);

    const intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60,
    };

    let counter;
    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
      counter = Math.floor(diffInSeconds / secondsInUnit);
      if (counter > 0) {
        return `${counter} ${unit}${counter === 1 ? '' : 's'} ago`;
      }
    }
    return 'Just now';
  }
}
