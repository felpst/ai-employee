import { Component, EventEmitter, Output } from '@angular/core';
import { IAIEmployeeCall } from '@cognum/interfaces';
import { NotificationsService } from '../../../services/notifications/notifications.service';
import { AIEmployeesService } from '../ai-employees.service';

@Component({
  selector: 'cognum-ai-employee-history',
  templateUrl: './ai-employee-history.component.html',
  styleUrls: ['./ai-employee-history.component.scss'],
})
export class AIEmployeeHistoryComponent {
  @Output() sortedData = new EventEmitter<any[]>();

  searchText = '';
  isLoading = true;
  calls: IAIEmployeeCall[] = [];
  filteredList: IAIEmployeeCall[] = [];

  constructor(
    private aiEmployeesService: AIEmployeesService,
    private notificationsService: NotificationsService
  ) {}

  ngOnInit() {
    this.loadCalls();
  }

  loadCalls() {
    this.isLoading = true;
    this.aiEmployeesService.loadCalls().subscribe({
      next: (calls) => {
        this.calls = calls;
        this.filteredList = calls;
        this.isLoading = false;
      },
      error: (error) => {
        console.log('An error occurred while listing calls: ', { error });
        this.notificationsService.show(
          'An error occurred while listing calls, please try again in a moment'
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

  get aiEmployee() {
    return this.aiEmployeesService.aiEmployee;
  }
}
