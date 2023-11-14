import { Component, Inject, Input } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'cognum-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
})
export class DialogComponent {
  @Input() title = '';
  @Input() content = '';
  @Input() confirmText = '';

  constructor(@Inject(MAT_DIALOG_DATA) public data: { title: string, content: string, confirmText: string }) {
    Object.assign(this, data);
  }
}
