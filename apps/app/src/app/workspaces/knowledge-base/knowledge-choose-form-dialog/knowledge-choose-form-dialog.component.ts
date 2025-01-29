import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { KnowledgeTypeEnum } from '@cognum/interfaces';

@Component({
  selector: 'cognum-knowledge-choose-form-dialog',
  templateUrl: './knowledge-choose-form-dialog.component.html',
  styleUrls: ['./knowledge-choose-form-dialog.component.scss'],
})
export class KnowledgeChooseFormDialogComponent {
  constructor(public dialogRef: MatDialogRef<KnowledgeChooseFormDialogComponent>) { }
  public get options() {
    return KnowledgeTypeEnum;
  }

  choose(option: KnowledgeTypeEnum): void {
    this.dialogRef.close(option);
  }

  closeModal() {
    this.dialogRef.close();
  }
}
