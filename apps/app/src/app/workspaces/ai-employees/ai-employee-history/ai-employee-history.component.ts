import { Component, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IAIEmployee, IChatRoom, IUser, IWorkspace } from '@cognum/interfaces';
import { WorkspacesService } from '../../workspaces.service';
import { AIEmployeesService } from '../ai-employees.service';

@Component({
  selector: 'cognum-ai-employee-history',
  templateUrl: './ai-employee-history.component.html',
  styleUrls: ['./ai-employee-history.component.scss'],
})
export class AIEmployeeHistoryComponent {
  @Output() sortedData = new EventEmitter<any[]>();

  chats: IChatRoom[] = [];
  searchText = '';
  createdByUser: IUser | null = null;
  workspace!: IWorkspace;
  aiEmployee!: IAIEmployee;

  constructor(
    private route: ActivatedRoute,
    private aiEmployeesService: AIEmployeesService,
    private workspaceService: WorkspacesService,
  ) {

  }

  ngOnInit() {
    this.workspace = this.workspaceService.selectedWorkspace;
    this.aiEmployee = this.aiEmployeesService.aiEmployee;
    this.route.data.subscribe(data => {
      const aiEmployeesWithChats = data['0'];
      this.chats = aiEmployeesWithChats
        .flatMap((aiEmployee: { chats: IChatRoom; }) => aiEmployee.chats)
        .filter((chat: { aiEmployee: { _id: string }; }) => chat.aiEmployee._id === this.aiEmployee._id)
    });
  }

  loadChats() {
    this.aiEmployeesService.load(this.workspace).subscribe(aiEmployeesWithChats => {
      this.chats = aiEmployeesWithChats.flatMap(aiEmployee => aiEmployee.chats);
    });
  }

  handleSortedData(sortedChats: IChatRoom[]) {
    this.chats = sortedChats;
  }

  filterChats() {
    this.chats = this.chats.filter(chat =>
      this.searchText && chat.name && chat.name.toLowerCase().includes(this.searchText.toLowerCase())
    ) || [...this.chats];
  }

  onSearch(searchText: string) {
    this.searchText = searchText;
    this.searchText ? this.filterChats() : this.clearSearch();
  }

  clearSearch() {
    this.searchText = '';
    this.loadChats();
  }
}
