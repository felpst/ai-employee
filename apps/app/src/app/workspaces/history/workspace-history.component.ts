import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { IAIEmployeeCall } from '@cognum/interfaces';
import { NotificationsService } from '../../services/notifications/notifications.service';
import { AIEmployeesService } from '../ai-employees/ai-employees.service';
import { WorkspacesService } from '../workspaces.service';

@Component({
  selector: 'cognum-workspace-history',
  templateUrl: './workspace-history.component.html',
  styleUrls: ['./workspace-history.component.scss'],
})
export class WorkspaceHistoryComponent implements OnInit {
  @Output() sortedData = new EventEmitter<any[]>();

  searchText = '';
  isLoading = true;
  calls: IAIEmployeeCall[] = [];
  filteredList: IAIEmployeeCall[] = [];

  constructor(
    private aiEmployeesService: AIEmployeesService,
    private workspaceService: WorkspacesService,
    private notificationsService: NotificationsService
  ) {}

  ngOnInit() {
    this.loadCalls();
  }

  loadCalls() {
    this.isLoading = true;
    this.aiEmployeesService.listByWorkspace(this.workspace._id).subscribe({
      next: (aiEmployees) => {
        const ids = aiEmployees.map(({ _id }) => _id);
        this.aiEmployeesService.loadCalls(ids).subscribe({
          next: (calls) => {
            this.calls = calls;
            this.filteredList = calls;
            this.isLoading = false;
          },
          error: (error) => {
            console.log('An error occurred while listing calls: ', {
              error,
            });
            this.notificationsService.show(
              'An error occurred while listing calls, please try again in a moment'
            );
            this.isLoading = false;
          },
        });
      },
      error: (error) => {
        console.log('An error occurred while listing employees: ', { error });
        this.notificationsService.show(
          'An error occurred while listing employees, please try again in a moment'
        );
        this.isLoading = false;
      },
    });
  }

  handleSortedData(sortedCalls: IAIEmployeeCall[]) {
    this.filteredList = sortedCalls;
  }

  filterCalls() {
    const searchText = this.searchText;
    this.filteredList = this.calls.filter((call) => {
      const { input, output } = call;
      return (
        searchText &&
        ((input && input.toLowerCase().includes(searchText.toLowerCase())) ||
          (output && output.toLowerCase().includes(searchText.toLowerCase())))
      );
    }) || [...this.calls];
  }

  onSearch(searchText: string) {
    this.searchText = searchText;
    return searchText ? this.filterCalls() : this.clearSearch();
  }

  clearSearch() {
    this.searchText = '';
    this.loadCalls();
  }

  get workspace() {
    return this.workspaceService.selectedWorkspace;
  }
}
