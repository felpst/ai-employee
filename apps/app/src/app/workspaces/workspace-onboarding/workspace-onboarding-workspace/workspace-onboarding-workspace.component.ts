import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IWorkspace } from '@cognum/interfaces';
import { UploadsService } from '../../../services/uploads/uploads.service';
import { validatorFile } from '../../../shared/validations';
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
      photo: [this.workspace.photo, []],
    });

    this.workspaceForm.valueChanges.subscribe(() => {
      this.showWarning = false;
    });
  }

  get workspace() {
    return this.workspacesService.selectedWorkspace;
  }

  ngOnInit(): void {
    const { name, photo, accessLink } = this.workspace;
    if (name !== 'DEFAULT_WORKSPACE') {
      this.workspaceForm.get('name')?.patchValue(name);
    }
    if (accessLink) {
      this.workspaceForm.get('link')?.patchValue(accessLink);
    }
    if (photo) {
      this.selectedImage = photo;
    }
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
    data.photo = this.workspace.photo;
    return this.workspacesService
      .update(data)
      .subscribe((workspace) => {
        this.workspacesService.selectedWorkspace = workspace;
        this.router.navigate(['../your-team'], { relativeTo: this.activatedRoute })
      });
  }

}
