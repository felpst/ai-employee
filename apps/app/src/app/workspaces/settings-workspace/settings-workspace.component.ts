import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IWorkspace } from '@cognum/interfaces';
import { AuthService } from '../../auth/auth.service';
import { NotificationsService } from '../../services/notifications/notifications.service';
import { UsersService } from '../../services/users/users.service';
import { WorkspacesService } from '../workspaces.service';

@Component({
  selector: 'cognum-settings-workspace',
  templateUrl: './settings-workspace.component.html',
  styleUrls: ['./settings-workspace.component.scss'],
})
export class SettingsWorkspaceComponent implements OnInit {
  @ViewChild('overviewContainer', { static: true })
  private overviewContainer!: ElementRef<HTMLDivElement>;
  // user config
  image = '';
  name = '';
  users: any = [];

  // workspace config
  workspaceImage = '';
  photo: File | null = null;
  selectedImage: string | null = null;
  workspace!: IWorkspace | null;
  workspaceData = '@cognum/selected-workspace';
  workspacesId!: string;
  workspaceName: any = '';
  updateForm = this.formBuilder.group({
    workspaceName: [this.workspaceName, [Validators.minLength(6)]],
    photo: [this.photo, []],
  });

  // others
  selectedItem: number | null = 1;
  isLoading = true;
  submitting = false;
  modal = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private usersService: UsersService,
    private workspacesService: WorkspacesService,
    private formBuilder: FormBuilder,
    private notificationsService: NotificationsService
  ) {
    this.route.params.subscribe((params) => {
      this.workspacesId = params['id'];
      this.getWorkspace();
    });
  }

  ngOnInit(): void {
    const userId = this.authService.user?._id;

    this.usersService.getById(userId).subscribe({
      next: (response: any) => {
        this.image = response.photo;
        this.name = response.name;
      },
    });

    this.workspacesService.get(this.workspacesId).subscribe({
      next: (response: any) => {
        this.users = response.users
        this.workspaceName = response.name;
        this.workspaceImage = response.photo
      },
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

  getWorkspace() {
    this.isLoading = true;
    return this.workspacesService
      .get(this.workspaceId)
      .subscribe((workspace) => {
        this.workspace = workspace;
        this.isLoading = false;
      });
  }

  onLoadList() {
    this.workspacesService.list().subscribe((data) => {
      const workspace = data.get(this.workspaceId) || null;
      this.workspace = workspace;
      this.isLoading = false;
    });
  }

  get workspaceId() {
    return localStorage.getItem(this.workspaceData) || '';
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
    const workspaceId = this.workspacesId;

    this.workspacesService.delete(workspaceId).subscribe({
      next: () => {
        this.notificationsService.show("Workspace deleted successfully")
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
      workspaceName = this.workspaceName;
    }

    const photo = this.updateForm.get('photo')?.value;
    const updateData = JSON.stringify({ workspaceName });

    this.workspacesService.update(this.workspacesId, updateData, photo).subscribe({
      next: () => {
        this.notificationsService.show('Successfully changed data!');
      },
      error: (error) => {
        this.notificationsService.show("Oops, it looks like there was an error... Please try again in a few minutes")
      }
    });
  }

}
