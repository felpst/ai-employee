import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { IChatRoom, IUser, IWorkspace } from '@cognum/interfaces';
import { ObjectId } from 'mongoose';
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

  @Output() sortedData = new EventEmitter<any[]>();

  originalChat: IChatRoom[] = [];
  chats: IChatRoom[] = [];
  searchText = '';
  createdByUser: IUser | null = null;
  history: any[] = [];
  workspace!: IWorkspace;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private chatService: ChatsService,
    private aiEmployeesService: AIEmployeesService,
    private workspaceService: WorkspacesService,
    private dialog: MatDialog) { }

  ngOnInit() {
    this.workspace = this.workspaceService.selectedWorkspace;
    this.loadChats();
  }

  loadChats() {
    this.aiEmployeesService.load(this.workspace).subscribe(aiEmployeesWithChats => {
      this.history = aiEmployeesWithChats.flatMap(aiEmployee => aiEmployee.chats.map(chat => ({
        _id: chat._id,
        users: [chat.createdBy, aiEmployee],
        date: chat.updatedAt,
        createdAt: chat.createdAt,
        historyTitle: `${(chat.createdBy as unknown as IUser).name || ''} started a new conversation with ${aiEmployee.name}`,
        chatName: chat.name,
        summary: chat.summary
      })));

      this.originalChat = [...this.history];
    });
  }

  handleSortedData(sortedChats: IChatRoom[]) {
    this.history = sortedChats;
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
              this.loadChats();
            },
            error => {
              console.error(error);
            }
          );
        }
      });
  }

  onChat(aiEmployee: ObjectId, chat: IChatRoom) {
    this.router.navigate(['..', 'employee', aiEmployee, 'chats', chat._id], { relativeTo: this.route });
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
        if (counter === 1) {
          return `${counter} ${unit} ago`;
        } else {
          return `${counter} ${unit}s ago`;
        }
      }
    }

    return 'Just now';
  }

  filterChats() {
    this.chats = this.history.filter(chat =>
      this.searchText && chat.chatName && chat.chatName.toLowerCase().includes(this.searchText.toLowerCase())
    ) || [...this.history];
  }

  onSearch(searchText: string) {
    this.searchText = searchText;
    this.searchText ? this.filterChats() : this.clearSearch();
  }

  clearSearch() {
    this.searchText = '';
    this.filterChats();
  }

}
