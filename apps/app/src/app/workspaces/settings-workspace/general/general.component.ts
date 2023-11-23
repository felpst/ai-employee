/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { IWorkspace } from '@cognum/interfaces';
import { AuthService } from '../../../auth/auth.service';
import { NotificationsService } from '../../../services/notifications/notifications.service';
import { UploadsService } from '../../../services/uploads/uploads.service';
import { DialogComponent } from '../../../shared/dialog/dialog.component';
import { validatorFile } from '../../../shared/validations';
import { WorkspacesService } from '../../workspaces.service';
import { UserType } from '../team-form/team-form.component';

@Component({
  selector: 'cognum-settings-team-form',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.scss'],
})
export class SettingsGeneralComponent implements OnInit {
  photo: File | null = null;
  updateForm = this.formBuilder.group({
    name: ['', [Validators.required, Validators.minLength(6)]],
    photo: [null, [] as any],
  });


  submitting = false;
  errors = [];
  showDeleteConfirmation = false;
  selectedImage: string | null = null;

  constructor(
    private authService: AuthService,
    private workspacesService: WorkspacesService,
    private formBuilder: FormBuilder,
    private uploadsService: UploadsService,
    private notificationsService: NotificationsService,
    public dialog: MatDialog,
    private router: Router,
  ) {

  }

  ngOnInit() {
    this.updateForm.patchValue({
      name: this.workspace?.name || '',
      photo: this.workspace?.photo || null,
    });
  }


  get user() {
    return this.authService.user
  }

  get workspace() {
    return this.workspacesService.selectedWorkspace
  }

  onSubmit() {
    if (!this.updateForm.valid) return;
    this.submitting = true;
    const { name } = this.updateForm.value;
    const data = { ...this.workspace, name: name || this.workspace.name || '' }
    this.updateData(data);
  }


  hasInputError(inputName: string, errorName: string) {
    return (
      this.updateForm.get(inputName)?.invalid &&
      this.updateForm.get(inputName)?.touched &&
      this.updateForm.get(inputName)?.hasError(errorName)
    );
  }

  onFileSelected(event: any, folder: string, fieldName = 'avatar') {
    try {
      const [file] = event.target.files;
      if (file) {
        const { name } = file;
        const extension = name.split('.')?.pop() || 'png';
        const filename = `${fieldName}.${extension}`;
        this.selectedImage = URL.createObjectURL(file);
        const control = this.updateForm.get('photo');
        control?.patchValue(file);
        control?.setValidators(validatorFile);
        control?.updateValueAndValidity();
        this.photo = file;
        this.uploadsService
          .single({
            file,
            folder,
            filename,
            parentId: this.workspace._id,
          })
          .subscribe((result) => {
            const { url } = result;
            const data = { ...this.workspace, photo: url }
            return this.updateData(data);
          });
      }
    } catch (error) {
      console.log('An error ocurring: ', { error });
    }
  }



  onRemoveWorkspace() {
    const dialogData = new DialogComponent({ title: 'Delete Workspace', content: 'Are you sure you want to remove this workspace?', confirmText: 'Yes' });

    const dialogRef = this.dialog.open(DialogComponent, {
      maxWidth: "400px",
      data: dialogData
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.deleteWorkspace();
      }
    });
  }

  private updateData(data: Partial<IWorkspace>) {
    const _users = data.users as UserType[];
    const users = _users?.map(({ permission, user }) => ({ permission, user: user.email }))
    return this.workspacesService.update({ ...data, users }).subscribe({
      next: (workspace) => {
        this.workspacesService.selectedWorkspace = workspace;
        this.notificationsService.show('Workspace updated successfully!');
        this.submitting = false;
      },
      error: () => {
        this.notificationsService.show(
          "Oops, it looks like there was an error... Please try again in a few minutes"
        );
        this.submitting = false;
        this.updateForm.reset();
      },
    });
  }

  private deleteWorkspace() {
    return this.workspacesService.delete(this.workspace._id).subscribe({
      next: () => {
        this.notificationsService.show('Workspace deleted successfully!');
        this.router.navigate(['/']);
      },
      error: (error) => {
        console.log({ error });
        this.notificationsService.show('An error occurred while deleting the workspace, please try again.');
      },
    });
  }


}
