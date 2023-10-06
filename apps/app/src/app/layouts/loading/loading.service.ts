/* eslint-disable @typescript-eslint/no-empty-function */
import { ChangeDetectorRef, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private loading = new Set<string>();
  cdr!: ChangeDetectorRef;

  constructor() {
    this.cdr?.detach();
    setInterval(() => {
      this.cdr?.detectChanges();
    }, 5000);
  }

  get isLoading() {
    return this.loading.size > 0;
  }

  add(key: string) {
    this.loading.add(key);
    this.cdr?.detectChanges();
  }
  remove(key: string) {
    this.loading.delete(key);
    this.cdr?.detectChanges();
  }

  watch(interval = 500) {
    return setInterval(() => {
      console.log(this.loading.values());
    }, interval);
  }
}
