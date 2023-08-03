import { Injectable } from '@angular/core';
import { IChat } from '@cognum/interfaces';
import { Observable } from 'rxjs';
import { CoreApiService } from '../services/apis/core-api.service';

@Injectable({
  providedIn: 'root',
})
export class DataSourcesService {
  selectedChat: string | null = null;
  dataSources: Map<string, IChat> = new Map<string, IChat>();

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
}
