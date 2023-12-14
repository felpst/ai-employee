import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'cognum-sort-buttons',
  templateUrl: './sort-buttons.component.html',
  styleUrls: ['./sort-buttons.component.scss'],
})
export class SortButtonsComponent {

  @Input() data: any[] = [];
  @Input() dateField: string = '';
  @Output() sortedData = new EventEmitter<any[]>();

  sortingType: 'new' | 'old' | 'acess' = 'new';
  sortingDirection: 'asc' | 'desc' = 'desc';
  activeButton = 'new';

  constructor() { }

  onButtonClick(button: string) {
    this.activeButton = button;
    this.sortData(button);
  }

  sortData(sortingCriterion: string) {
    let sortedData = [...this.data];

    if (sortingCriterion === 'acess') {
      sortedData.sort(() => Math.random() - 0.5);
    } else {
      const sortingDirection = sortingCriterion === 'old' ? 'asc' : 'desc';

      sortedData.sort((a: any, b: any) => {
        if (a[this.dateField] && b[this.dateField]) {
          const dateA = new Date(a[this.dateField]).getTime();
          const dateB = new Date(b[this.dateField]).getTime();

          const sortOrder = sortingDirection === 'asc' ? 1 : -1;

          return dateA < dateB ? -sortOrder : dateA > dateB ? sortOrder : 0;
        }
        return 0;
      });
    }

    this.sortedData.emit(sortedData);
  }
}