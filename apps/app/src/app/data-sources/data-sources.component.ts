import { Component, OnInit } from '@angular/core';
import { IDataSource } from '@cognum/interfaces';
import { AuthService } from '../auth/auth.service';
import { DataSourcesService } from './data-sources.service';

@Component({
  selector: 'cognum-data-sources',
  templateUrl: './data-sources.component.html',
  styleUrls: ['./data-sources.component.scss'],
})
export class DataSourcesComponent implements OnInit {
  selectedFile: File | null = null;
  dataSourcesTree: Partial<IDataSource>[] | any[] = [];

  constructor(
    private dataSourcesService: DataSourcesService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadDataSources();
  }

  loadDataSources() {
    this.dataSourcesTree = [];
    this.dataSourcesService.list().subscribe(() => {
      const root: Partial<IDataSource> | any = {
        type: 'folder',
        children: this.dataSourcesService.listFrom(),
        metadata: {
          opened: true,
        },
      };
      console.log(root);

      this.dataSourcesTree.push(root);
    });
  }

  get selectedDataSource() {
    return this.dataSourcesService.selectedDataSource;
  }

  onDataSourceSelected(dataSourceId: string | null = null) {
    this.dataSourcesService.selectedDataSource = dataSourceId;
  }

  onFileSelected(event: any) {
    const file = <File>event.target.files[0];
    this.dataSourcesService.upload(file).subscribe((response) => {
      console.log(response);
      this.loadDataSources();
    });
  }
}
