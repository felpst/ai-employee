import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { NotificationsService } from '../../services/notifications/notifications.service';
import { UploadsService } from '../../services/uploads/uploads.service';
import { UsersService } from '../../services/users/users.service';
import { Step } from '../../shared/stepper/stepper.component';
@Component({
  selector: 'cognum-account-settings',
  templateUrl: './account-settings.component.html',
  styleUrls: ['./account-settings.component.scss'],
})
export class AccountSettingsComponent implements OnInit {
  navs: Step[] = [
    { title: 'General', routerLink: './' }
  ]
  name = '';
  photo: File | null = null;
  updateForm = this.formBuilder.group({
    name: [this.name, [Validators.required, Validators.minLength(6)]],
    photo: [this.photo, []],
  });
  submitting = false;
  showUpdateError = false;
  errors = [];
  showDeleteConfirmation = false;
  image = '';
  selectedImage: string | null = null;
  workspaceId: string | null = null;
  defaultImage: string = 'assets/icons/user.svg';

  constructor(
    private location: Location,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router,
    private notificationsService: NotificationsService,
    private usersService: UsersService,
    private uploadsService: UploadsService,
    private route: ActivatedRoute
  ) {
    this.updateForm.valueChanges.subscribe(() => {
      this.showUpdateError = false;
    });
  }

  openDeleteAccountModal() {
    this.showDeleteConfirmation = true;
  }

  onRedirect() {
    this.location.back();
  }

  ngOnInit() {
    console.log("OnInit");

    // const resolvedData = this.route.snapshot.data;
    // if (resolvedData && resolvedData[0]) {
    //   this.updateForm.patchValue({
    //     name: resolvedData[0].name,
    //   });
    //   this.name = resolvedData[0].name;
    //   this.image = resolvedData[0].photo;
    // }
  }

  confirmDeleteAccount() {
    this.usersService.delete(this.user._id).subscribe({
      next: () => {
        this.router.navigate(['/auth/register']);
      },
    });

    this.showDeleteConfirmation = false;
  }

  cancelDeleteAccount() {
    this.showDeleteConfirmation = false;
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
        control?.setValidators(this.validatorFile);
        control?.updateValueAndValidity();
        this.photo = file;
        this.uploadsService
          .single({
            file,
            folder,
            filename,
            parentId: this.user._id,
          })
          .subscribe((result) => {
            this.user.photo = result.url;
          });
      }
    } catch (error) {
      console.log('An error ocurring: ', { error });
    }
  }

  hasInputError(inputName: string, errorName: string) {
    return (
      this.updateForm.get(inputName)?.invalid &&
      this.updateForm.get(inputName)?.touched &&
      this.updateForm.get(inputName)?.hasError(errorName)
    );
  }

  async onSubmit() {
    if (!this.updateForm.valid) return;
    this.submitting = true;
    const { name } = this.updateForm.value;
    const data = { ...this.user };
    if (!!name && name.length >= 6) {
      data.name = name;
    }

    this.usersService.update(this.user._id, { ...data }).subscribe({
      next: () => {
        this.notificationsService.show('Successfully changed data!');
      },
    });
  }

  selectedItem: number | null = 1;

  selectItem(itemNumber: number): void {
    this.selectedItem = itemNumber;
  }

  get user() {
    return this.authService.user;
  }
}
