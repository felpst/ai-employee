import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IChatRoom, IUser, IWorkspace } from '@cognum/interfaces';
import { AIEmployeesService } from '../ai-employees/ai-employees.service';
import { WorkspacesService } from '../workspaces.service';

@Component({
  selector: 'cognum-workspace-history',
  templateUrl: './workspace-history.component.html',
  styleUrls: ['./workspace-history.component.scss'],
})

export class WorkspaceHistoryComponent implements OnInit {

  @Output() sortedData = new EventEmitter<any[]>();

  chats: IChatRoom[] = [];
  searchText = '';
  createdByUser: IUser | null = null;
  workspace!: IWorkspace;

  constructor(
    private route: ActivatedRoute,
    private aiEmployeesService: AIEmployeesService,
    private workspaceService: WorkspacesService,
  ) { }

  ngOnInit() {
    this.workspace = this.workspaceService.selectedWorkspace;
    this.route.data.subscribe(data => {
      const aiEmployeesWithChats = data['0'];
      this.chats = aiEmployeesWithChats.flatMap((aiEmployee: { chats: IChatRoom; }) => aiEmployee.chats);
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
