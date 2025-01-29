import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { IKnowledge, IUser, IWorkspace, KnowledgeTypeEnum } from '@cognum/interfaces';
import { AuthService } from '../../../auth/auth.service';
import { NotificationsService } from '../../../services/notifications/notifications.service';
import { UploadsService } from '../../../services/uploads/uploads.service';
import { UsersService } from '../../../services/users/users.service';
import { DialogComponent } from '../../../shared/dialog/dialog.component';
import { validatorUrl } from '../../../shared/validations';
import { WorkspacesService } from '../../workspaces.service';
import { KnowledgeBaseService } from '../knowledge-base.service';

@Component({
  selector: 'cognum-knowledge-form',
  templateUrl: './knowledge-form.component.html',
  styleUrls: ['./knowledge-form.component.scss'],
})
export class KnowledgeFormComponent {
  validFileExtensions = ['.pdf', '.csv'];

  knowledge: IKnowledge | undefined;
  workspace!: IWorkspace;
  inputType!: KnowledgeTypeEnum;
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
    private uploadsService: UploadsService,
    @Inject(MAT_DIALOG_DATA)
    private data: {
      knowledge: IKnowledge;
      workspace: IWorkspace;
      inputType: KnowledgeTypeEnum;
    }
  ) {

    this.form = this.formBuilder.group({
      title: ['', [Validators.required]],
      data: ['', this.inputType === KnowledgeTypeEnum.Document ? [Validators.required] : []],
      file: ['', this.inputType === KnowledgeTypeEnum.File ? [Validators.required] : []],
      contentUrl: ['', this.inputType === KnowledgeTypeEnum.Html ? [Validators.required, validatorUrl] : []],
      htmlUpdateFrequency: [''],
    });

    this.initializeForm();
    this.initializeMembers();
    this.workspace = this.workspaceService.selectedWorkspace;
  }

  public get types() {
    return KnowledgeTypeEnum;
  }

  initializeForm(): void {
    if (this.data.knowledge) {
      this.knowledge = this.data.knowledge;
      this.form.patchValue(this.data.knowledge);

      this.inputType = this.knowledge.type;
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

  async onSave() {
    this.isLoading = true;
    const data = this.form.value;
    const isFile = this.inputType === KnowledgeTypeEnum.File;

    if (isFile && data.file) {
      data['contentUrl'] = await this.uploadFile(data.file);
    }

    const newKnowledge = this.prepareKnowledgeObject(data);
    this.saveOrUpdateKnowledge(newKnowledge);
  }

  private async uploadFile(file: File): Promise<string> {
    try {
      const { url } = await new Promise<{ url: string; }>((resolve) => {
        this.uploadsService
          .single({
            file,
            folder: 'knowledges',
            filename: file.name,
            parentId: this.workspace._id,
          })
          .subscribe(resolve);
      });

      return url;
    } catch (error) {
      this.handleError('Error uploading file. Please try again.', error);
      throw error;
    }
  }

  private prepareKnowledgeObject(data: Partial<IKnowledge & { file: File; }>): Partial<IKnowledge> {
    const newKnowledge: Partial<IKnowledge> = {
      ...data,
      type: this.inputType,
    };
    delete (<IKnowledge & { file?: File; }>newKnowledge).file;

    if (this.knowledge) {
      return {
        ...this.handlePermissions(this.knowledge, this.members, this.creatorId as string),
        ...newKnowledge
      };
    }

    return { ...newKnowledge, workspace: this.workspace._id, permissions: this.getDefaultPermissions() };
  }

  private saveOrUpdateKnowledge(newKnowledge: Partial<IKnowledge> & { timeZone?: string; }) {
    const formData = new FormData();
    const isUpdate = !!this.knowledge;

    if (isUpdate) {
      formData.append('_id', this.knowledge?._id + '');
    } else if (this.inputType === KnowledgeTypeEnum.Html) {
      newKnowledge.timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    }

    formData.append('json', JSON.stringify(newKnowledge));
    formData.append('file', this.form.value.file);

    const request = this.knowledge
      ? this.knowledgeBaseService.update(formData)
      : this.knowledgeBaseService.create(formData);

    request.subscribe({
      next: (res) => this.handleSuccess(
        isUpdate ? 'Successfully updated knowledge' : 'Successfully created knowledge',
        res
      ),
      error: (error) => this.handleError(
        isUpdate ? 'Error updating knowledge. Please try again.' : 'Error creating knowledge. Please try again.',
        error
      ),
    });
  }

  private getDefaultPermissions(): { userId: string; permission: 'Editor' | 'Reader'; }[] {
    return [
      ...this.members.map((member) => (
        <{ userId: string, permission: 'Reader' | 'Editor'; }>{
          userId: member._id, permission: 'Reader'
        })),
      { userId: this.creatorId + '', permission: 'Editor' },
    ];
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
      const validExtensions = this.validFileExtensions.map(ext => ext.replace('.', ''));
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

        if (!this.form.value.title) {
          const splittedName = file.name.split('.');
          splittedName.pop();
          this.form.patchValue({ title: splittedName.join('.') });
        }
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

  ensureValidation() {
    const control = this.form.get('contentUrl');
    control?.setValidators([validatorUrl, Validators.required]); // force validators
    control?.updateValueAndValidity();

    console.log({ form: this.form });
  }
}
