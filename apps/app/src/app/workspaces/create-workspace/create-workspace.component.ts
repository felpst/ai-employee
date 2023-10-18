    import { Component } from '@angular/core';
    import { FormBuilder, FormGroup, Validators } from '@angular/forms';
    import { WorkspacesService } from '../workspaces.service';
    import { Router } from '@angular/router';

    @Component({
      selector: 'cognum-create-workspace',
      templateUrl: './create-workspace.component.html',
      styleUrls: ['./create-workspace.component.scss'],
    })
    export class CreateWorkspaceComponent {
      workspaceForm: FormGroup;
      teamForm: FormGroup;
      aiEmployeeForm: FormGroup;
      isLoading: boolean = false;
      currentStep = 1;
      numSteps = 4;
      showWarning: boolean = false;
      selectedFiles: File[] = [];
      selectedAvatar: string | null = null;
      isAvatarSelected: boolean = false;
      availableAvatars = [
        '../../../assets/icons/avatar(2).svg'
      ];

     
      constructor(
        private formBuilder: FormBuilder,
        private workspaceService: WorkspacesService,
        private router: Router
      ) {
        this.workspaceForm = this.formBuilder.group({
          name: ['', Validators.required],
          link: ['', Validators.required],
          allowJoin: [false],
          workspacePhoto: [null]
        });
    
        this.teamForm = this.formBuilder.group({
          email: ['', Validators.required],
        });
    
        this.aiEmployeeForm = this.formBuilder.group({
          description: ['', Validators.required],
          name: ['', Validators.required],
        });
      }
      workspacePhoto: string | null = null;
    
      onFileSelected(event: any, fileType: string) {
        const files: FileList = event.target.files;
        for (let i = 0; i < files.length; i++) {
          const file: File = files[i];
          const reader = new FileReader();
          reader.onloadend = () => {
            if (file.type.match('image.*')) {
              this.workspacePhoto = reader.result as string;
              this.selectedFiles.push(file);
            }
          };
          if (file) {
            reader.readAsDataURL(file);
          }
        }
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

   
     
      selectAvatar(avatarPath: string) {
        this.selectedAvatar = avatarPath;
        this.aiEmployeeForm.patchValue({ avatar: avatarPath });
        
        this.isAvatarSelected = true;
      }
    
    Conclude() {
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
        workspacePhoto: workspaceData.workspacePhoto , 
        accessLink: workspaceData.link,
        private: false, 
        users: teamData.email.split(','), 
        employee: {
          name: aiEmployeeData.name,
          role: aiEmployeeData.description,
          avatar: this.selectedAvatar,
        },
      };

      console.log(this.selectedAvatar)
      if (typeof this.selectedAvatar === 'string') {
        const blob = new Blob([this.selectedAvatar], { type: 'text/plain' });
        const file = new File([blob], 'avatar.txt');
        this.selectedFiles.push(file);
    
      }
    
 
      formData.append('json', JSON.stringify(submitData));
      for (let i = 0; i < this.selectedFiles.length; i++) {
        formData.append('files', this.selectedFiles[i]);
      }
      this.isLoading = true; // Ativar indicador de carregamento antes de fazer a chamada ao serviço

      this.workspaceService.createWorkspace(formData).subscribe(
        (response) => {
          console.log('Workspace criado com sucesso!', response);
          const newWorkspaceId = response._id;
          this.router.navigate(['/workspaces', newWorkspaceId]);
        },
        (error) => {
          console.error('Erro ao criar o workspace', error.error);
        }
      ).add(() => {
        this.isLoading = false; // Desativar indicador de carregamento após a chamada ao serviço
      });
    }
      }