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

  

  closeModal(): void {
    this.dialogRef.close();
  }

  createAiEmployee(): void {
    if (this.form && this.form.valid) {
      const descriptionControl = this.form.get('description');
      const nameControl = this.form.get('name');
  
      if (descriptionControl && nameControl) {
        const aiEmployeeData = {
          name: nameControl.value,
          role: descriptionControl.value
        };
  
        this.employeeService.create(aiEmployeeData).subscribe(
          (createdEmployee) => {
            this.notificationsService.show('Successfully created Ai Employee');
            this.dialogRef.close();
          },
          (error) => {
            console.error('Error creating AI Employee:', error);
            this.notificationsService.show(
              'Error creating Ai Employee. Please try again.'
            );
          }
        );
      } else {
        console.error('Form controls are null or undefined.');
      }
    } else {
      // Form is not valid, show a validation error message
      console.error('Form is not valid. Please fill in all fields.');
    }
  }
  
}
