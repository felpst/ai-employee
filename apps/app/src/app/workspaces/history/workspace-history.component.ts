import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { IChat, IUser } from '@cognum/interfaces';
import { ObjectId } from 'mongoose';
import { AuthService } from '../../auth/auth.service';
import { DialogComponent } from '../../shared/dialog/dialog.component';
import { AIEmployeesService } from '../ai-employees/ai-employees.service';
import { ChatsService } from '../ai-employees/chats/chats.service';
import { WorkspacesService } from '../workspaces.service';


@Component({
  selector: 'cognum-history',
  templateUrl: './workspace-history.component.html',
  styleUrls: ['./workspace-history.component.scss'],
})

export class WorkspaceHistoryComponent implements OnInit {
  originalChat: IChat[] = [];
  chats: IChat[] = [];
  searchText = '';
  createdByUser: IUser | null = null;
  history: any[] = [];

  sortingType: 'newFirst' | 'oldFirst' | 'mix' = 'newFirst';
  sortingDirection: 'asc' | 'desc' = 'desc';
  activeButton = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private chatService: ChatsService,
    private workspacesService: WorkspacesService,
    private aiEmployeesService: AIEmployeesService,
    private dialog: MatDialog) { }

  ngOnInit() {
    this.originalChat = [...this.history];
    this.sortChats();
    for (const aiEmployee of this.aiEmployeesService.aiEmployees.values()) {
      for (const chat of aiEmployee.chats) {
        this.history.push({
          _id: chat._id,
          users: [chat.createdBy, aiEmployee],
          date: chat.updatedAt,
          createdAt: chat.createdAt,
          historyTitle: `${(chat.createdBy as unknown as IUser).name || ''} started a new conversation with ${aiEmployee.name}`,
          chatName: chat.name,
          summary: chat.summary
        })
      }
    }
  }

  deleteChat(chat: IChat) {
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
              this.chats = this.chats.filter(c => c._id !== chat._id);
            },
            error => {
              console.error(error);
            }
          );
        }
      });
  }

  onChat(aiEmployee: ObjectId, chat: IChat) {
    this.router.navigate([aiEmployee, 'chats', chat._id], { relativeTo: this.route });
  }

  formatChatDate(date: Date): string {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - new Date(date).getTime()) / 1000);

    const intervals = {
      ano: 31536000,
      mes: 2592000,
      semana: 604800,
      dia: 86400,
      hora: 3600,
      minuto: 60,
    };

    let counter;
    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
      counter = Math.floor(diffInSeconds / secondsInUnit);
      if (counter > 0) {
        if (counter === 1) {
          return `Há ${counter} ${unit} atrás`;
        } else {
          return `Há ${counter} ${unit}s atrás`;
        }
      }
    }

    return 'Agora mesmo';
  }

  filterChats() {
    this.chats = this.originalChat.filter(chat =>
      chat.name.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  onSearch(event: any) {
    this.searchText = event.target.value;
    this.filterChats();
  }

  clearSearch() {
    this.searchText = '';
    this.chats = this.originalChat;
  }

  sortChats() {
    if (this.sortingType === 'newFirst') {
      this.history.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (this.sortingType === 'oldFirst') {
      this.history.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    }

    if (this.sortingDirection === 'desc') {
      this.history.reverse();
    }
  }

  onButtonClick(sortingType: 'newFirst' | 'oldFirst' | 'mix') {
    this.sortingType = sortingType;
    this.sortChats();
    this.activeButton = sortingType;
  }
}
