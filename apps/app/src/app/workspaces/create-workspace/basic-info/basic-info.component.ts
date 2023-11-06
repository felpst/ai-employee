import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { IWorkspace } from '@cognum/interfaces';
import { UploadsService } from '../../../services/uploads/uploads.service';
import { WorkspacesService } from '../../workspaces.service';

@Component({
  selector: 'cognum-basic-info',
  templateUrl: './basic-info.component.html',
  styleUrls: ['./basic-info.component.scss'],
})
export class BasicInfoComponent implements OnInit {
  @Input({ required: true }) workspace!: IWorkspace;
  @Output() updateWorkspaceEvent = new EventEmitter();
  @Output() changeStepEvent = new EventEmitter();
  workspaceForm!: FormGroup;
  photo: File | null = null;
  selectedImage: string | null = null;
  showWarning = false;

  constructor(
    private formBuilder: FormBuilder,
    private workspacesService: WorkspacesService,
    private uploadsService: UploadsService
  ) {
    this.workspaceForm = this.formBuilder.group({
      name: ['', Validators.required],
      link: ['', Validators.required],
      photo: [this.photo, []],
    });

    this.workspaceForm.valueChanges.subscribe(() => {
      this.showWarning = false;
    });
  }
  ngOnInit(): void {
    const { name, accessLink } = this.workspace;
    if (name !== 'DEFAULT_WORKSPACE') {
      this.workspaceForm.get('name')?.patchValue(name);
    }
    if (accessLink) {
      this.workspaceForm.get('link')?.patchValue(accessLink);
    }
  }

  validatorFile(control: AbstractControl): ValidationErrors | null {
    const file = control.value;
    if (!file) return null;
    const { name, type, size } = file;
    // Maximum size: 10MB
    const maxFileSize = 10 * 1024 * 1024;
    const validFileTypes = [
      'image/jpeg',
      'image/png',
      'application/octet-stream',
    ];
    const conditionType =
      !validFileTypes.includes(type) ||
      !/jpg$|jpeg$|png$|svg$/g.test(name.toLowerCase());
    const conditionSize = size > maxFileSize || size <= 0;

    if (conditionType)
      return { invalidFormat: 'Valid formats: .png, .jpg, .jpeg and .svg' };
    if (conditionSize) return { invalidSize: 'Maximum size: 10MB' };
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
        const control = this.workspaceForm.get('photo');
        control?.patchValue(file);
        control?.setValidators(this.validatorFile);
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
            this.workspace.photo = result.url;
          });
      }
    } catch (error) {
      console.log('An error ocurring: ', { error });
    }
  }

  hasInputError(inputName: string, errorName: string) {
    return (
      this.workspaceForm.get(inputName)?.invalid &&
      this.workspaceForm.get(inputName)?.touched &&
      this.workspaceForm.get(inputName)?.hasError(errorName)
    );
  }

  onSubmit() {
    if (!this.workspaceForm.valid) return;
    const { photo, ...rest } = this.workspaceForm.value;
    return this.workspacesService
      .update({ ...this.workspace, ...rest })
      .subscribe((result: any) => {
        this.updateWorkspaceEvent.emit(result);
        this.changeStepEvent.emit('UsersInfo');
      });
  }
}
