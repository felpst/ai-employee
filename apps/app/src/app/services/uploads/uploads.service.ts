import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CoreApiService } from '../apis/core-api.service';

type UploadFileProps = {
  file: File;
  folder: string;
  parentId?: string;
  filename?: string;
};

@Injectable({
  providedIn: 'root',
})
export class UploadsService {
  private route = 'uploads';
  constructor(private coreApiService: CoreApiService) {}

  single({ file, ...rest }: UploadFileProps): Observable<{ url: string }> {
    const formData = new FormData();
    const jsonData = { ...rest };
    formData.append('json', JSON.stringify(jsonData));
    formData.append('file', file);
    return new Observable((observer) => {
      this.coreApiService
        .post(`${this.route}/single`, formData, {
          headers: { Accept: 'application/json, text/plain, */*' },
          responseType: 'json',
        })
        .subscribe({
          next: (response) => {
            observer.next(response);
          },
          error: (error) => {
            observer.error(error);
          },
        });
    });
  }
}
