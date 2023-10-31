import { Component, ElementRef, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { NotificationsService } from '../../services/notifications/notifications.service';
import { UsersService } from '../../services/users/users.service';
import { WorkspacesService } from '../workspaces.service';

@Component({
  selector: 'cognum-settings-workspace',
  templateUrl: './settings-workspace.component.html',
  styleUrls: ['./settings-workspace.component.scss'],
})
export class SettingsWorkspaceComponent {
  @ViewChild('overviewContainer', { static: true })
  private overviewContainer!: ElementRef<HTMLDivElement>;
  // user config
  users: any = [];

  // workspace config
  photo: File | null = null;
  selectedImage: string | null = null;
  updateForm = this.formBuilder.group({
    workspaceName: [this.workspace.name, [Validators.minLength(6)]],
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
    private notificationsService: NotificationsService,
  ) { }
  
  get user() {
    return this.authService.user
  }

  get workspace() {
    return this.workspacesService.selectedWorkspace
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
      error: (error) => {
        this.notificationsService.show("Oops, it looks like there was an error... Please try again in a few minutes")
      }
    });
  }

}
