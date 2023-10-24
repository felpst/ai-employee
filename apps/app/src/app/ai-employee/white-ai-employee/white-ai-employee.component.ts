import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AiEmployeeComponent } from '../ai-employee.component';
import { EmployeeService } from '../ai-employee.service';
import { NotificationsService } from '../../services/notifications/notifications.service';


@Component({
  selector: 'cognum-white-ai-employee',
  templateUrl: './white-ai-employee.component.html',
  styleUrls: ['./white-ai-employee.component.scss'],
})
export class WhiteAiEmployeeComponent {
  form: FormGroup;
  showWarning = false;
  selectedFile: File | null = null;
  selectedAvatar: string | null = null;
  isAvatarSelected = false;
  availableAvatars = ['../../../assets/icons/avatar(2).svg'];
  isLoading = false;

  constructor(
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<AiEmployeeComponent>,
    private notificationsService: NotificationsService,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private employeeService: EmployeeService) {

    this.form = this.formBuilder.group({
      description: ['', [Validators.required]],
      name: ['', [Validators.required]],
    });

  }


  selectAvatar(avatarPath: string) {
    const img = new Image();
    img.crossOrigin = 'Anonymous'; // Para permitir o acesso a imagens de outros domínios
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
  
      // Certifique-se de que o contexto de renderização não seja nulo
      if (ctx) {
        // Redimensionar a imagem (por exemplo, para 800x600)
        const maxWidth = 800;
        const maxHeight = 600;
        let width = img.width;
        let height = img.height;
  
        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }
  
        canvas.width = width;
        canvas.height = height;
  
        // Desenhar a imagem redimensionada no canvas
        ctx.drawImage(img, 0, 0, width, height);
  
        // Obter a imagem redimensionada como uma string base64
        const resizedImageData = canvas.toDataURL('image/jpeg', 0.7); // 0.7 é a qualidade da imagem (de 0 a 1)
  
        // Enviar a imagem redimensionada como base64 para o backend
        this.selectedAvatar = resizedImageData;
        this.form.patchValue({ avatar: this.selectedAvatar });
        this.isAvatarSelected = true;
      } else {
        // Lidar com a situação quando o contexto de renderização é nulo
        console.error('Failed to get 2D rendering context.');
      }
    };
  
    // Carregar a imagem
    img.src = avatarPath;
  }
  
  onFileSelected(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files && inputElement.files.length > 0) {
      this.selectedFile = inputElement.files[0];
      this.form.patchValue({ avatar: this.selectedFile });
      this.isAvatarSelected = true;
    }
  }
  


  closeModal(): void {
    this.dialogRef.close();
  }

  createAiEmployee(): void {
    if (this.form && this.form.valid) {
      const descriptionControl = this.form.get('description');
      const nameControl = this.form.get('name');

      if (descriptionControl && nameControl) {
        const avatarValue: string = this.selectedAvatar || ''; 
            console.log('Selected Avatar:', this.selectedAvatar);
        const aiEmployeeData = {
          name: nameControl.value,
          role: descriptionControl.value,
          avatar: avatarValue,
        };
        this.isLoading = true;
        this.employeeService.create(aiEmployeeData).subscribe(
          (createdEmployee) => {
            this.notificationsService.show('Successfully created Ai Employee');
            console.log(createdEmployee);
            this.isLoading = false;
            this.dialogRef.close('success'); 
          },
          (error) => {
            console.error('Error creating AI Employee:', error);
            this.notificationsService.show('Error creating Ai Employee. Please try again.');
          }
        );
      } else {
        this.showWarning = true;
        return;
      }}
  }

}
