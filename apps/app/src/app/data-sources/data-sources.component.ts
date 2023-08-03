import { Component } from '@angular/core';
import { DataSourcesService } from './data-sources.service';

@Component({
  selector: 'cognum-data-sources',
  templateUrl: './data-sources.component.html',
  styleUrls: ['./data-sources.component.scss'],
})
export class DataSourcesComponent {
  selectedFile: File | null = null;

  constructor(private dataSourcesService: DataSourcesService) {}

  onNew() {
    console.log('new');
  }

  onFileSelected(event: any) {
    this.selectedFile = <File>event.target.files[0];
  }

  onSubmit() {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.dataSourcesService.upload(this.selectedFile!).subscribe((response) => {
      console.log(response);
    });
  }
}
