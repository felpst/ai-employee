import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { IKnowledge, IWorkspace } from '@cognum/interfaces';
import { NotificationsService } from '../../services/notifications/notifications.service';
import { DialogComponent } from '../../shared/dialog/dialog.component';
import { KnowledgeBaseService } from '../knowledge-base.service';

@Component({
  selector: 'cognum-knowledge-form',
  templateUrl: './knowledge-form.component.html',
  styleUrls: ['./knowledge-form.component.scss'],
})
export class KnowledgeFormComponent {
  knowledge: IKnowledge | undefined;
  form: FormGroup;
  markdownOptions = {
    showPreviewPanel: false,
  };
  isLoading = false;

  constructor(
    private formBuilder: FormBuilder,
    private knowledgeBaseService: KnowledgeBaseService,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<KnowledgeFormComponent>,
    private notificationsService: NotificationsService,
    @Inject(MAT_DIALOG_DATA)
    private data: {
      knowledge: IKnowledge;
      workspace: IWorkspace;
    }
  ) {
    this.form = this.formBuilder.group({
      title: ['', [Validators.required]],
      data: ['', [Validators.required]],
    });

    if (data.knowledge) {
      this.knowledge = data.knowledge;
      this.form.patchValue(data.knowledge);
    }
  }

  onSave() {
    this.isLoading = true;
  
    if (this.knowledge) {
      this.knowledge.data = this.form.value.data;
      this.knowledgeBaseService.update(this.knowledge).subscribe({
        next: (res) => {
          this.notificationsService.show('Successfully updated knowledge');
          this.dialogRef.close(res);
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error updating knowledge:', error);
          this.notificationsService.show('Error updating knowledge. Please try again.');
          this.isLoading = false;
        }
      });
    } else {
      const data = this.form.value;
      const { _id } = this.data.workspace;
      this.knowledgeBaseService.create({ ...data, workspace: _id }).subscribe({
        next: (res) => {
          this.notificationsService.show('Successfully created knowledge');
          this.dialogRef.close(res);
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error creating knowledge:', error);
          this.notificationsService.show('Error creating knowledge. Please try again.');
          this.isLoading = false;
        }
      });
    }
  }
  
  onRemove() {
    this.dialog
      .open(DialogComponent, {
        data: {
          title: 'Delete Knowledge',
          content: 'Are you sure you want to delete this knowledge?',
          confirmText: 'Delete',
        },
      })
      .afterClosed()
      .subscribe((result) => {
        if (result && this.knowledge) {
          this.knowledgeBaseService.delete(this.knowledge).subscribe((res) => {
            this.notificationsService.show('Successfully deleted knowledge');
            this.dialogRef.close(res);
          });
        }
      });
  }

  closeModal(): void {
    const isFormFilled = Object.values(this.form.value).some(fieldValue => fieldValue);
  
    if (isFormFilled) {
      this.onSave();
    } else {
      this.dialogRef.close();
    }
  }

}
