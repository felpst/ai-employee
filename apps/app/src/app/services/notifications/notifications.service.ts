import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  constructor(private matSnackBar: MatSnackBar) {}

  show(message: string) {
    this.matSnackBar.open(message, 'OK', {
      duration: 4000,
    });
  }
}
