import { Component } from '@angular/core';

@Component({
  selector: 'cognum-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
})
export class SearchBarComponent {
  searchText = '';
}
