import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { WorkspacesService } from '../workspaces.service';

@Component({
  selector: 'cognum-create-workspace',
  templateUrl: './create-workspace.component.html',
  styleUrls: ['./create-workspace.component.scss'],
})
export class CreateWorkspaceComponent {
  workspaceForm: FormGroup;
  teamForm: FormGroup;
  aiEmployeeForm: FormGroup;
  isLoading = false;
  currentStep = 1;
  numSteps = 4;
  showWarning = false;
  selectedFiles: File[] = [];
  selectedAvatar: string | null = null;
  isAvatarSelected = false;
  availableAvatars = ['../../../assets/icons/avatar(2).svg'];
  photo: string | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private workspaceService: WorkspacesService,
    private authService: AuthService,
    private router: Router
  ) {
    this.workspaceForm = this.formBuilder.group({
      name: ['', Validators.required],
      link: ['', Validators.required],
      allowJoin: [false],
      photo: [null],
    });

    this.teamForm = this.formBuilder.group({
      email: ['', [Validators.required, this.emailListValidator]],
    });

    this.aiEmployeeForm = this.formBuilder.group({
      description: ['', Validators.required],
      name: ['', Validators.required],
    });
  }

  onLogOut() {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/auth']);
      },
    });
  }

  get email() {
    return this.authService.user ? this.authService.user.email : '';
  }

  onFileSelected(event: any, fileType: string) {
    const files: FileList = event.target.files;
    for (let i = 0; i < files.length; i++) {
      const file: File = files[i];
      const reader = new FileReader();
      reader.onloadend = () => {
        if (file.type.match('image.*')) {
          this.photo = reader.result as string;
          this.selectedFiles.push(file);
        }
      };
      if (file) {
        reader.readAsDataURL(file);
      }
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

  nextStep() {
    switch (this.currentStep) {
      case 1:
        if (this.workspaceForm.invalid) {
          this.showWarning = true;
          return;
        }
        break;
      case 2:
        if (this.teamForm.invalid) {
          this.showWarning = true;
          return;
        }
        break;
      case 3:
        if (this.aiEmployeeForm.invalid || !this.isAvatarSelected) {
          this.showWarning = true;
          return;
        }
        break;
    }

    this.showWarning = false;
    this.currentStep++;
    if (this.currentStep > this.numSteps) {
      this.currentStep = 1;
    }
  }

  skipStep() {
    this.currentStep++;
    if (this.currentStep > this.numSteps) {
      this.currentStep = 1;
    }
  }

  prevStep() {
    this.showWarning = false;
    this.currentStep--;
    if (this.currentStep > this.numSteps || this.currentStep <= 0) {
      this.currentStep = 1;
    }
  }

  selectAvatar(avatarPath: string) {
    this.selectedAvatar = avatarPath;
    this.aiEmployeeForm.patchValue({ avatar: avatarPath });

    this.isAvatarSelected = true;
  }

  conclude() {
    if (this.aiEmployeeForm.invalid || !this.isAvatarSelected) {
      this.showWarning = true;
      return;
    }

    const formData = new FormData();
    const workspaceData = this.workspaceForm.value;
    const teamData = this.teamForm.value;
    const aiEmployeeData = this.aiEmployeeForm.value;

    const submitData = {
      name: workspaceData.name,
      description: aiEmployeeData.description,
      photo: workspaceData.photo,
      accessLink: workspaceData.link,
      private: false,
      usersEmails: teamData.email.split(','),
      employee: {
        name: aiEmployeeData.name,
        role: aiEmployeeData.description,
        avatar: this.selectedAvatar,
      },
    };

    if (typeof this.selectedAvatar === 'string') {
      const extension = this.selectedAvatar.split('.').pop();
      const blob = new Blob([this.selectedAvatar], { type: 'text/plain' });
      const file = new File([blob], `avatar.${extension}`);
      this.selectedFiles.push(file);
    }
    formData.append('json', JSON.stringify(submitData));
    for (let i = 0; i < this.selectedFiles.length; i++) {
      formData.append('files', this.selectedFiles[i]);
    }
    this.isLoading = true; // Ativar indicador de carregamento antes de fazer a chamada ao serviço

    this.workspaceService
      .createWorkspace(formData)
      .subscribe(
        (response) => {
          console.log('Workspace criado com sucesso!', response);
          const newWorkspaceId = response._id;
          this.router.navigate(['/workspaces', newWorkspaceId]);
        },
        (error) => {
          console.error('Erro ao criar o workspace', error.error);
        }
      )
      .add(() => {
        this.isLoading = false; // Desativar indicador de carregamento após a chamada ao serviço
      });
  }
}
