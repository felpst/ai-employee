import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'cognum-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
})
export class SearchBarComponent {
  searchText = '';
  @Output() searchUpdated: EventEmitter<string> = new EventEmitter<string>();
  @Output() searchCleared: EventEmitter<void> = new EventEmitter<void>();

  emitSearchUpdate() {
    this.searchUpdated.emit(this.searchText);
  }

  emitSearchClear() {
    this.searchText = '';
    this.searchCleared.emit();
  }
}
