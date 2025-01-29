import { Injectable } from '@angular/core';
import { IDataSource } from '@cognum/interfaces';
import { Observable } from 'rxjs';
import { CoreApiService } from '../services/apis/core-api.service';

@Injectable({
  providedIn: 'root',
})
export class DataSourcesService {
  selectedDataSource: string | null = null;
  dataSources: Map<string, IDataSource> = new Map<string, IDataSource>();

  constructor(private coreApiService: CoreApiService) {}

  upload(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    return new Observable((observer) => {
      this.coreApiService.post('data-sources/upload', formData).subscribe({
        next: (response) => {
          observer.next(response);
        },
      });
    });
  }

  list(): Observable<Map<string, IDataSource>> {
    return new Observable((observer) => {
      (
        this.coreApiService.get('data-sources?sort=-createdAt') as Observable<
          IDataSource[]
        >
      ).subscribe({
        next: (dataSources: IDataSource[]) => {
          dataSources.forEach((dataSource) =>
            this.dataSources.set(dataSource._id, dataSource)
          );
          observer.next(this.dataSources);
        },
      });
    });
  }

  listFrom(
    parent: string | IDataSource | undefined = undefined
  ): IDataSource[] {
    return Array.from(this.dataSources.values()).filter(
      (dataSource) => dataSource.parent === parent
    );
  }
}
