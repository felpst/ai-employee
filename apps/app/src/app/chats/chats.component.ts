import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { IChat } from '@cognum/interfaces';
import { DialogComponent } from '../shared/dialog/dialog.component';
import { ChatsService } from './chats.service';

@Component({
  selector: 'cognum-chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.scss'],
})
export class ChatsComponent implements OnInit {
  selected: IChat | null = null;

  constructor(
    private router: Router,
    private chatsService: ChatsService,
    private dialog: MatDialog
  ) {}

  get selectedChat(): string | null {
    return this.chatsService.selectedChat;
  }

  ngOnInit() {
    this.onLoadList();
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

  onLoadList() {
    this.chatsService.list().subscribe();
  }

  onNewChat() {
    this.chatsService.create().subscribe({
      next: (chat) => {
        this.onLoadList();
        this.router.navigate(['/chats', chat._id]);
      },
    });
  }

  onChat(chat: IChat) {
    this.chatsService.selectedChat = chat._id;
    this.router.navigate(['/chats', chat._id]);
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
              this.onLoadList();
              this.router.navigate(['/chats']);
            },
          });
        }
      });
  }
}
