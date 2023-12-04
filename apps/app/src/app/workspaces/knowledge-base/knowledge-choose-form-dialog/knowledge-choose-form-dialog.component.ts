import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'cognum-knowledge-choose-form-dialog',
  templateUrl: './knowledge-choose-form-dialog.component.html',
  styleUrls: ['./knowledge-choose-form-dialog.component.scss'],
})
export class KnowledgeChooseFormDialogComponent {
  constructor(public dialogRef: MatDialogRef<KnowledgeChooseFormDialogComponent>) { }

  choose(option: 'file' | 'document'): void {
    this.dialogRef.close(option);
  }

  closeModal() {
    this.dialogRef.close();
  }
}
