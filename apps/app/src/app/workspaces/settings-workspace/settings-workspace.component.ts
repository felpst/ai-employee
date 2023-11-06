<<<<<<< HEAD
import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { NotificationsService } from '../../services/notifications/notifications.service';
=======
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IUser, IWorkspace } from '@cognum/interfaces';
import { forkJoin } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { NotificationsService } from '../../services/notifications/notifications.service';
import { SettingsService } from '../../settings/settings.service';
>>>>>>> 9eff4f730a9b0e97b486c3e58956447ac5490a07
import { WorkspacesService } from '../workspaces.service';

@Component({
  selector: 'cognum-settings-workspace',
  templateUrl: './settings-workspace.component.html',
  styleUrls: ['./settings-workspace.component.scss'],
})
<<<<<<< HEAD
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
=======
export class SettingsWorkspaceComponent implements OnInit {
  @ViewChild('overviewContainer', { static: true })
  private overviewContainer!: ElementRef<HTMLDivElement>;
  selectedItem: number | null = 2;
  image = '';
  name = '';
  workspace!: IWorkspace | null;
  isLoading = true;
  background: string;
  workspaceData = '@cognum/selected-workspace';
  workspacesId!: string;
>>>>>>> 9eff4f730a9b0e97b486c3e58956447ac5490a07

  // others
  selectedItem: number | null = 2;
  isLoading = true;
  submitting = false;
  modal = false;

  usersId: any = [];

  photo: File | null = null;
  updateForm = this.formBuilder.group({
    name: [this.name, [Validators.minLength(6)]],
    photo: [this.photo, []],
  });
  submitting = false;
  showUpdateError = false;
  errors = [];
  showDeleteConfirmation = false;
  selectedImage: string | null = null;

  constructor(
    private router: Router,
    private authService: AuthService,
<<<<<<< HEAD
    private workspacesService: WorkspacesService,
    private formBuilder: FormBuilder,
    private notificationsService: NotificationsService,
=======
    private settingsService: SettingsService,
    private workspacesService: WorkspacesService,
    private formBuilder: FormBuilder,
    private notificationsService: NotificationsService
>>>>>>> 9eff4f730a9b0e97b486c3e58956447ac5490a07
  ) {
    this.teamForm = this.formBuilder.group({
      email: ['', [Validators.required, this.emailListValidator]],
    });
<<<<<<< HEAD

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
=======
    this.background = this.getRandomColorFromSet();
  }

  getInitials(userName: string): string {
    if (userName) {
      const names = userName.split(' ');
      const initials = names[0][0] + (names[1] ? names[1][0] : '');
      return initials.toUpperCase();
    }
    return '';
  }

  getRandomColorFromSet(): string {
    const predefinedColors = [
      '#22333B',
      '#0A0908',
      '#BFCC94',
      '#E6AACE',
      '#0D1821',
      '#344966',
      '#A9927D',
      '#5E503F',
      '#1C1F33',
      '#666370',
      '#D33E43',
    ];
    const randomIndex = Math.floor(Math.random() * predefinedColors.length);
    return predefinedColors[randomIndex];
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

  loadUsers() {
    const userRequests = this.usersId.map((userId: string) =>
      this.settingsService.getUserById(userId)
    );

    forkJoin(userRequests).subscribe((users: any) => {
      this.usersId = users.map((user: IUser) => ({
        ...user,
        photo: user.photo,
        name: user.name,
        email: user.email,
      }));
    });
>>>>>>> 9eff4f730a9b0e97b486c3e58956447ac5490a07
  }

  get workspace() {
    return this.workspacesService.selectedWorkspace
  }

  get email() {
    return this.authService.user ? this.authService.user.email : '';
  }

<<<<<<< HEAD
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
=======
    this.workspacesService.get(this.workspacesId).subscribe((data) => {
      console.log(data);

      this.usersId = data.users;
      this.workspaceName = data.name;
      // this.workspacePhoto = data.pro
      this.loadUsers();
    });
>>>>>>> 9eff4f730a9b0e97b486c3e58956447ac5490a07

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

<<<<<<< HEAD
  onRedirect() {
    return this.router.navigate(['/workspaces']);
  }

  onModal(isOpen: boolean) {
    this.modal = isOpen;
=======
  get selectedWorkspace() {
    return this.workspacesService.selectedWorkspace;
  }

  onLoadList() {
    this.workspacesService.list().subscribe((data) => {
      const workspace = data.get(this.workspaceId) || null;
      this.workspace = workspace;
      this.isLoading = false;
    });
  }

  async onSubmit() {
    if (!this.updateForm.valid) return;
    this.submitting = true;

    let name = this.updateForm.get('name')?.value;
    if (!name) {
      name = this.name;
    }

    const profilePhoto = this.updateForm.get('profilePhoto')?.value;
    const updateData = JSON.stringify({ name });
    const workspaceId = this.workspacesId;

    this.workspacesService
      .update(workspaceId, updateData, profilePhoto)
      .subscribe({
        next: () => {
          this.notificationsService.show('Successfully changed data!');
        },
      });
  }

  get workspaceId() {
    return localStorage.getItem(this.workspaceData) || '';
>>>>>>> 9eff4f730a9b0e97b486c3e58956447ac5490a07
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
