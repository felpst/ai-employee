import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { IKnowledge, IUser, IWorkspace } from '@cognum/interfaces';
import { AuthService } from '../../../auth/auth.service';
import { NotificationsService } from '../../../services/notifications/notifications.service';
import { UsersService } from '../../../services/users/users.service';
import { DialogComponent } from '../../../shared/dialog/dialog.component';
import { WorkspacesService } from '../../workspaces.service';
import { KnowledgeBaseService } from '../knowledge-base.service';

@Component({
  selector: 'cognum-knowledge-form',
  templateUrl: './knowledge-form.component.html',
  styleUrls: ['./knowledge-form.component.scss'],
})
export class KnowledgeFormComponent {
  knowledge: IKnowledge | undefined;
  workspace!: IWorkspace;
  inputType!: 'document' | 'file';
  members: IUser[] = [];
  fileName: string | undefined;
  form!: FormGroup;
  markdownOptions = {
    showPreviewPanel: false,
  };
  isLoading = false;
  creatorId: string | undefined;

  constructor(
    private formBuilder: FormBuilder,
    private knowledgeBaseService: KnowledgeBaseService,
    private workspaceService: WorkspacesService,
    private usersService: UsersService,
    private authService: AuthService,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<KnowledgeFormComponent>,
    private notificationsService: NotificationsService,
    @Inject(MAT_DIALOG_DATA)
    private data: {
      knowledge: IKnowledge;
      workspace: IWorkspace;
      inputType: 'document' | 'file';
    }
  ) {
    this.form = this.formBuilder.group({
      title: ['', [Validators.required]],
      data: ['', this.inputType === 'document' ? [Validators.required] : []],
      file: ['', this.inputType === 'file' ? [Validators.required] : []],
    });

    this.initializeForm();
    this.initializeMembers();
    this.workspace = this.workspaceService.selectedWorkspace;
  }

  initializeForm(): void {
    if (this.data.knowledge) {
      this.knowledge = this.data.knowledge;
      this.form.patchValue(this.data.knowledge);

      this.inputType = this.knowledge.data ? 'document' : 'file';
      if (this.inputType === 'file') this.fileName = this.knowledge.description;
    } else {
      this.inputType = this.data.inputType;
    }
  }

  initializeMembers(): void {
    this.creatorId = this.authService.user?._id;
    this.usersService.list().subscribe((members: IUser[]) => {
      this.members = members.filter((member) => member._id !== this.creatorId);
    });
  }

  onSave() {
    this.isLoading = true;
    const data = this.form.value;

    const isFile = this.inputType === 'file';
    let newKnowledge: Partial<IKnowledge> = {
      ...data,
      file: undefined,
      isFile
    };
    const formData = new FormData();

    if (isFile) {
      formData.append('file', data.file);
    }

    if (this.knowledge) {
      const modifiedKnowledge = this.handlePermissions(
        this.knowledge,
        this.members,
        this.creatorId as string
      );

      newKnowledge = { ...modifiedKnowledge, ...newKnowledge };
      formData.append('_id', this.knowledge._id + '');
      formData.append('json', JSON.stringify(newKnowledge));

      this.knowledgeBaseService
        .update(formData)
        .subscribe({
          next: (res) => this.handleSuccess('Successfully updated knowledge', res),
          error: (error) => this.handleError('Error updating knowledge. Please try again.', error),
        });
    } else {
      const { _id } = this.workspace;
      const defaultPermissions: { userId: string, permission: 'Editor' | 'Reader'; }[] = this.members.map((member) => ({
        userId: member._id,
        permission: 'Reader',
      }));
      defaultPermissions.push({
        userId: this.creatorId + '',
        permission: 'Editor',
      });

      newKnowledge = {
        ...newKnowledge,
        workspace: _id,
        permissions: defaultPermissions,
      };

      formData.append('json', JSON.stringify(newKnowledge));

      this.knowledgeBaseService
        .create(formData)
        .subscribe({
          next: (res) => this.handleSuccess('Successfully created knowledge', res),
          error: (error) => this.handleError('Error creating knowledge. Please try again.', error),
        });
    }
  }

  handleSuccess(message: string, res: any) {
    this.notificationsService.show(message);
    this.dialogRef.close(res);
    this.isLoading = false;
  }

  handleError(message: string, error: any) {
    console.error(message, error);
    this.notificationsService.show(message);
    this.isLoading = false;
  }

  handlePermissions(
    knowledge: IKnowledge,
    members: IUser[],
    creatorId: string
  ) {
    const modifiedKnowledge = { ...knowledge };

    if (!knowledge.permissions || knowledge.permissions.length === 0) {
      const defaultPermissions = members.map((member) => ({
        userId: member._id,
        permission: 'Reader' as 'Reader' | 'Editor',
      }));
      defaultPermissions.push({
        userId: creatorId,
        permission: 'Editor' as 'Reader' | 'Editor',
      });

      modifiedKnowledge.permissions = defaultPermissions;
    } else if (
      knowledge.permissions.some(
        (perm) => perm.userId === creatorId && perm.permission === 'Editor'
      )
    ) {
      members.forEach((member) => {
        const memberPermission = knowledge.permissions.find(
          (perm) => perm.userId === member._id
        );
        if (!memberPermission) {
          modifiedKnowledge.permissions.push({
            userId: member._id,
            permission: 'Reader',
          });
        }
      });
    }

    return modifiedKnowledge;
  }

  onFileSelected(event: any) {
    try {
      const validExtensions = ['pdf'];
      const fileSizeMbLimit = 500;
      const file: File = event.target.files[0];

      if (file) {
        const ext = file.name.split('.').pop();
        const fileMbSize = (file.size / 1024) / 1024;

        if (!validExtensions.includes(ext + ''))
          throw new Error(`File type "${ext}" is not supported.`);
        if (fileMbSize > fileSizeMbLimit)
          throw new Error(`File size exceeds ${fileSizeMbLimit}MB`);

        this.fileName = file.name;
        this.form.patchValue({ file });
      }
    } catch (error) {
      this.handleError((error as Error).message, error);
    }
  }

  onRemove() {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        title: 'Delete Knowledge',
        content: 'Are you sure you want to delete this knowledge?',
        confirmText: 'Delete',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && this.knowledge) {
        this.knowledgeBaseService.delete(this.knowledge).subscribe({
          next: (res) => {
            this.notificationsService.show('Successfully deleted knowledge');
            this.dialogRef.close(res);
          },
          error: (error) => {
            console.error('Error deleting knowledge. Please try again.', error);
            this.notificationsService.show('Error deleting knowledge. Please try again.');
          },
        });
      }
    });
  }

  closeModal(): void {
    this.dialogRef.close();
  }
}
