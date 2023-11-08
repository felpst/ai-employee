import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { WorkspacesService } from '../workspaces.service';
import { Observable, of } from 'rxjs';
import { DialogComponent } from '../../shared/dialog/dialog.component';
import { IChat } from '@cognum/interfaces';
import { AuthService } from '../../auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ChatsService } from '../ai-employees/chats/chats.service';
import { IUser } from '@cognum/interfaces';


@Component({
  selector: 'cognum-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss'],

})
export class HistoryComponent implements OnInit {
  originalChat: IChat[] = [];
  chats: IChat[] = [];
  searchText = ''; 
  createdByUser: IUser | null = null;


  sortingType: 'newFirst' | 'oldFirst' | 'mix' = 'newFirst';
  sortingDirection: 'asc' | 'desc' = 'desc';
  activeButton = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private chatService: ChatsService,
    private workspacesService: WorkspacesService,
    private dialog: MatDialog) { }

 
    ngOnInit() {
      const workspaceId = this.workspacesService.selectedWorkspace._id;
      this.chatService.listByWorkspace(workspaceId).subscribe((chats: IChat[]) => {
        this.originalChat = chats;
        this.filterChats();
        const createdByUserId = this.originalChat[0]?.createdBy as string;
        console.log(createdByUserId);
        if (createdByUserId) {
          this.authService.getUserById(createdByUserId).subscribe((user: IUser) => {
            if (user) {
              this.createdByUser= user; 
            } 
            console.log(this.createdByUser); // Dados do usuário obtidos com sucesso
          });
        }
      });
    }
    
    
    
  get users(): IUser[] {
    return this.workspacesService.selectedWorkspace.users as IUser[];
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
  
  getLastUpdatedTime(chat: IChat): string {
    if (!chat.updatedAt) {
      return 'Nunca atualizado'; // ou qualquer outra mensagem que você queira exibir para casos em que updatedAt é undefined
    }
    const updatedAt = new Date(chat.updatedAt);
    const currentTime = new Date();
    const timeDifference = Math.abs(currentTime.getTime() - updatedAt.getTime());
  
    const minute = 60 * 1000;
    const hour = minute * 60;
    const day = hour * 24;
    const week = day * 7;
    const month = day * 30; // Aproximadamente 30 dias por mês
  
    if (timeDifference < minute) {
      return 'Há menos de um minuto';
    } else if (timeDifference < hour) {
      const minutes = Math.floor(timeDifference / minute);
      return `Há ${minutes} ${minutes === 1 ? 'minuto' : 'minutos'} atrás`;
    } else if (timeDifference < day) {
      const hours = Math.floor(timeDifference / hour);
      return `Há ${hours} ${hours === 1 ? 'hora' : 'horas'} atrás`;
    } else if (timeDifference < week) {
      const days = Math.floor(timeDifference / day);
      return `Há ${days} ${days === 1 ? 'dia' : 'dias'} atrás`;
    } else if (timeDifference < month) {
      const weeks = Math.floor(timeDifference / week);
      return `Há ${weeks} ${weeks === 1 ? 'semana' : 'semanas'} atrás`;
    } else {
      const months = Math.floor(timeDifference / month);
      return `Há ${months} ${months === 1 ? 'mês' : 'meses'} atrás`;
    }
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
  sortChats(sortingCriterion: string) {
    if (sortingCriterion === 'newFirst') {
      this.sortingDirection = 'desc';
    } else if (sortingCriterion === 'oldFirst') {
      this.sortingDirection = 'asc';
    } else if (sortingCriterion === 'mix') {
      this.chats.sort(() => Math.random() - 0.5);
    } else {
      this.sortingDirection = 'desc';
    }

    if (sortingCriterion !== 'mix') {
      this.chats.sort((a: IChat, b: IChat) => {
        if (a.createdAt && b.createdAt) {
          const dateA = new Date(a.createdAt);
          const dateB = new Date(b.createdAt);

          const sortOrder = this.sortingDirection === 'asc' ? 1 : -1;

          if (dateA < dateB) {
            return -sortOrder;
          }
          if (dateA > dateB) {
            return sortOrder;
          }
        }
        return 0;
      });
    }
  }

  onButtonClick(button: string) {
    this.activeButton = button;
    this.sortChats(button);
  }
}
