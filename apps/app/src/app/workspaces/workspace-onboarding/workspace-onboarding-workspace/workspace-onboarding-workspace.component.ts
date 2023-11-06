import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IWorkspace } from '@cognum/interfaces';
import { UploadsService } from '../../../services/uploads/uploads.service';
import { WorkspacesService } from '../../workspaces.service';

@Component({
  selector: 'cognum-workspace-onboarding-workspace',
  templateUrl: './workspace-onboarding-workspace.component.html',
  styleUrls: ['./workspace-onboarding-workspace.component.scss'],
})
export class WorkspaceOnboardingWorkspaceComponent implements OnInit {
  @Output() updateWorkspaceEvent = new EventEmitter();
  @Output() changeStepEvent = new EventEmitter();
  workspaceForm!: FormGroup;
  photo: File | null = null;
  selectedImage: string | null = null;
  showWarning = false;

  constructor(
    private formBuilder: FormBuilder,
    private workspacesService: WorkspacesService,
    private uploadsService: UploadsService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.workspaceForm = this.formBuilder.group({
      name: [this.workspace.name, [Validators.required, Validators.minLength(3)]],
      photo: [this.photo, []],
    });

    this.workspaceForm.valueChanges.subscribe(() => {
      this.showWarning = false;
    });
  }

  get workspace() {
    return this.workspacesService.selectedWorkspace;
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
    const data: Partial<IWorkspace> = this.workspaceForm.value;
    data._id = this.workspace._id;
    return this.workspacesService
      .update(data)
      .subscribe((workspace) => {
        this.workspacesService.selectedWorkspace = workspace;
        this.router.navigate(['../your-team'], { relativeTo: this.activatedRoute })
      });
  }

}
