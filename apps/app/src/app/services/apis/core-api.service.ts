import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { env } from 'apps/app/src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CoreApiService {
  private _url: string = env.apis.core.url;

  constructor(private http: HttpClient) {}

  get(path: string, options?: any): Observable<any> {
    return this.http.get(`${this._url}/${path}`, {
      withCredentials: true,
      ...options,
    });
  }

  post(path: string, data: any, options?: any): Observable<any> {
    return this.http.post(`${this._url}/${path}`, data, {
      withCredentials: true,
      ...options,
    });
  }

  put(path: string, data: any, options?: any): Observable<any> {
    return this.http.put(`${this._url}/${path}`, data, {
      withCredentials: true,
      ...options,
    });
  }

  patch(path: string, data: any, options?: any): Observable<any> {
    return this.http.patch(`${this._url}/${path}`, data, {
      withCredentials: true,
      ...options,
    });
  }

  delete(path: string, options?: any): Observable<any> {
    return this.http.delete(`${this._url}/${path}`, {
      withCredentials: true,
      ...options,
    });
  }
}
