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
import { WorkspacesService } from '../workspaces.service';

@Component({
  selector: 'cognum-settings-workspace',
  templateUrl: './settings-workspace.component.html',
  styleUrls: ['./settings-workspace.component.scss'],
})
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

  workspaceName!: string;
  workspacePhoto = '';

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
    private route: ActivatedRoute,
    private authService: AuthService,
    private settingsService: SettingsService,
    private workspacesService: WorkspacesService,
    private formBuilder: FormBuilder,
    private notificationsService: NotificationsService
  ) {
    this.route.params.subscribe((params) => {
      this.workspacesId = params['id'];
      this.getWorkspace();
    });
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
  }

  ngOnInit(): void {
    const userId = this.authService.user?._id;

    this.settingsService.getUserById(userId).subscribe({
      next: (response) => {
        this.image = response.profilePhoto;
        this.name = response.name;
      },
    });

    this.workspacesService.get(this.workspacesId).subscribe((data) => {
      console.log(data);

      this.usersId = data.users;
      this.workspaceName = data.name;
      // this.workspacePhoto = data.pro
      this.loadUsers();
    });

    const workspaces = this.workspacesService.workspaces;

    this.overviewContainer.nativeElement.classList.add('active');

    if (workspaces.size === 0) {
      return this.onLoadList();
    } else {
      this.workspace =
        this.workspacesService.workspaces.get(this.workspaceId) || null;
      this.isLoading = false;
    }
  }

  getWorkspace() {
    this.isLoading = true;
    return this.workspacesService
      .get(this.workspaceId)
      .subscribe((workspace) => {
        this.workspace = workspace;
        this.isLoading = false;
      });
  }

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
  }

  selectItem(itemNumber: number): void {
    this.selectedItem = itemNumber;
  }

  onRedirect() {
    return this.router.navigate(['/workspaces']);
  }
}
