/* eslint-disable @typescript-eslint/ban-ts-comment */
import { HttpParams } from '@angular/common/http';
import { Component,  EventEmitter, OnInit, Output  } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import {  IWorkspace } from '@cognum/interfaces';
import { Location } from '@angular/common';
import { AuthService } from '../../../auth/auth.service';
import { NotificationsService } from '../../../services/notifications/notifications.service';
import { DialogComponent } from '../../../shared/dialog/dialog.component';
import { WorkspacesService } from '../../workspaces.service';
import { validatorFile } from '../../../shared/validations';
import { Router } from '@angular/router';
import { UploadsService } from '../../../services/uploads/uploads.service';

@Component({
  selector: 'cognum-settings-team-form',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.scss'],
})
export class SettingsGeneralComponent {
  @Output() updateWorkspaceEvent = new EventEmitter();
  @Output() changeStepEvent = new EventEmitter();
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
    private location: Location 
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
    const { name, photo } = this.updateForm.value;
    if (!this.updateForm.valid) return;
  
    if (photo instanceof File) {
      this.updateWorkspaceWithPhoto(photo);
    } else {
      const newName = name || this.workspace.name || ''; // Certifique-se de ter uma string válida
      this.updateWorkspaceName(newName);
    }
    
    this.submitting = true;
  }
  
  
  private updateWorkspaceWithPhoto(newPhoto: File) {
    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result as string;
      const updatedWorkspace: Partial<IWorkspace> = {
        ...this.workspace,
        photo: dataUrl,
      };
  
      this.updateData(updatedWorkspace, 'Workspace photo updated successfully!');
    };
    reader.readAsDataURL(newPhoto);
  }
  

  hasInputError(inputName: string, errorName: string) {
    return (
      this.updateForm.get(inputName)?.invalid &&
      this.updateForm.get(inputName)?.touched &&
      this.updateForm.get(inputName)?.hasError(errorName)
    );
  }

private updateWorkspaceName(newName: string) {
  const updatedWorkspace: Partial<IWorkspace> = {
    ...this.workspace,
    name: newName,
  };
  this.updateData(updatedWorkspace, 'Workspace name updated successfully!');
  this.reload
}

private updateData(data: Partial<IWorkspace>, message: string) {
  return this.workspacesService.update(data).subscribe({
    next: () => {
      this.reload().subscribe({
        next: (workspace) => {
          this.workspacesService.selectedWorkspace = workspace;
          this.notificationsService.show(message);
          this.submitting = false;
          this.updateForm.reset();
          this.location.back();
        },
        error: (error) => {
          console.log({ error });
          this.notificationsService.show(
            `An error occurred while fetching workspace details, please try again in a moment`
          );
          this.submitting = false;
          this.updateForm.reset();
        },
      });
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

  reload() {
    let params = new HttpParams();
  

    return this.workspacesService.get(this.workspace._id, { params });
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
        const timestamp = new Date().getTime();
        this.uploadsService
          .single({
            file,
            folder,
            filename,
            parentId: this.workspace._id,
          })
          .subscribe((result) => {
            this.workspace.photo = `${result.url}?${timestamp}`;
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
