import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { NotificationsService } from '../../services/notifications/notifications.service';
import { WorkspacesService } from '../workspaces.service';

@Component({
  selector: 'cognum-settings-workspace',
  templateUrl: './settings-workspace.component.html',
  styleUrls: ['./settings-workspace.component.scss'],
})
export class SettingsWorkspaceComponent {
  // user config
  users: any = [];

  // workspace config
  photo: File | null = null;
  selectedImage: string | null = null;
  updateForm = this.formBuilder.group({
    workspaceName: [this.workspace.name, [Validators.minLength(6)]],
    photo: [this.photo, []],
  });
  teamForm: FormGroup;
  idUserSubmit = ''

  // others
  selectedItem: number | null = 2;
  isLoading = true;
  submitting = false;
  modal = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private workspacesService: WorkspacesService,
    private formBuilder: FormBuilder,
    private notificationsService: NotificationsService,
  ) {
    this.teamForm = this.formBuilder.group({
      email: ['', [Validators.required, this.emailListValidator]],
    });

    const controlEmail = this.teamForm.get('email');
    
    this.users = this.workspace.users;
    controlEmail?.valueChanges
      .pipe(
        map((value: any) => {
          return value;
        }),
        filter((email) => {
          return email && this.isEmail(email);
        }),
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe((email) => {
        this.authService.checkEmailRegistered(email).subscribe({
          
          next: (response) => {
            this.idUserSubmit = response._id
            controlEmail.setErrors({
              emailAlreadyExists: true,
            });
          },
          error: () => {
            controlEmail.setErrors({
              emailAlreadyExists: null,
            });
            controlEmail.updateValueAndValidity();
          },
        });
      });
    
  }
  
  get user() {
    return this.authService.user
  }

  get workspace() {
    return this.workspacesService.selectedWorkspace
  }

  get email() {
    return this.authService.user ? this.authService.user.email : '';
  }

  validatorFile(control: AbstractControl): ValidationErrors | null {
    const file = control.value;
    if (!file) return null;
    const { name, type, size } = file;
    // Tamanho máximo: 10MB
    const maxFileSize = 10 * 1024 * 1024;
    const validFileTypes = ['image/jpeg', 'image/png'];
    const conditionType =
      !validFileTypes.includes(type) ||
      !/jpg$|jpeg$|png$/g.test(name.toLowerCase());
    const conditionSize = !(size <= maxFileSize);

    if (conditionType)
      return { custom: 'Formatos válidos: .png, .jpg e .jpeg' };
    if (conditionSize) return { custom: 'Tamanho máximo: 5MB' };
    return null;
  }

  onFileSelected(event: any) {
    try {
      const [file] = event.target.files;
      if (file) {
        this.selectedImage = URL.createObjectURL(file);
        const control = this.updateForm.get('photo');
        control?.patchValue(file);
        control?.setValidators(this.validatorFile);
        control?.updateValueAndValidity();
        this.photo = file;
      }
    } catch (error) {
      console.log('An error ocurring: ', { error });
    }
  }

  emailListValidator(control: FormControl): { [key: string]: any } | null {
    const emails: string[] = (control.value as string)
      .split(',')
      .map((email) => email.trim());
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    for (const email of emails) {
      if (!emailRegex.test(email)) {
        return { invalidEmail: true };
      }
    }
    return null;
  }

  selectItem(itemNumber: number): void {
    this.selectedItem = itemNumber;
    this.modal = false;
  }

  onRedirect() {
    return this.router.navigate(['/workspaces']);
  }

  onModal(isOpen: boolean) {
    this.modal = isOpen;
  }

  async onDelete() {
    const workspaceId = this.workspace._id;

    this.workspacesService.delete(workspaceId).subscribe({
      next: () => {
        this.notificationsService.show("Workspace deleted successfully")
        this.router.navigate(['/'])
      }
    })
  }

  async onAddUser() {
    const formData = new FormData();
    this.users.push(this.idUserSubmit);

    formData.append('json', JSON.stringify({ users: this.users }));

    this.workspacesService.update(this.workspace._id, JSON.stringify({ users: this.users })).subscribe({
      next: () => {
        this.notificationsService.show('Successfully added users!')
        window.location.reload();
      },
      error: () => {
        this.notificationsService.show("Oops, it looks like there was an error... Please try again in a few minutes")
      }
    })
  }

  async onSubmit() {
    if (!this.updateForm.valid) return;
    this.submitting = true;

    let workspaceName = this.updateForm.get('workspaceName')?.value;
    
    if (!workspaceName) {
      workspaceName = this.workspace.name;
    }

    const photo = this.updateForm.get('photo')?.value;
    const updateData = JSON.stringify({ workspaceName });

    this.workspacesService.update(this.workspace._id, updateData, photo).subscribe({
      next: () => {
        this.notificationsService.show('Successfully changed data!');
      },
      error: () => {
        this.notificationsService.show("Oops, it looks like there was an error... Please try again in a few minutes")
      }
    });
  }

  private isEmail(s: string) {
    return s?.indexOf('@') !== -1;
  }

}
