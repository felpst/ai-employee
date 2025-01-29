/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { IAIEmployee } from '@cognum/interfaces';
import { AuthService } from '../../../../auth/auth.service';
import { NotificationsService } from '../../../../services/notifications/notifications.service';
import { DialogComponent } from '../../../../shared/dialog/dialog.component';
import { WorkspacesService } from '../../../workspaces.service';
import { AIEmployeesService } from '../../ai-employees.service';

@Component({
  selector: 'cognum-ai-employee-general-settings',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.scss'],
})
export class AIEmployeeGeneralComponent implements OnInit {
  generalForm!: FormGroup;
  availableAvatars = [
    'https://storage.googleapis.com/factory-assets/avatars/Avatar1.jpeg',
    'https://storage.googleapis.com/factory-assets/avatars/Avatar2.jpeg',
    'https://storage.googleapis.com/factory-assets/avatars/Avatar3.jpeg',
    'https://storage.googleapis.com/factory-assets/avatars/Avatar4.jpeg',
    'https://storage.googleapis.com/factory-assets/avatars/Avatar5.jpeg',
    'https://storage.googleapis.com/factory-assets/avatars/Avatar6.jpeg',
    'https://storage.googleapis.com/factory-assets/avatars/Avatar7.jpeg',
    'https://storage.googleapis.com/factory-assets/avatars/Avatar8.jpeg',
    'https://storage.googleapis.com/factory-assets/avatars/Avatar9.jpeg',
    'https://storage.googleapis.com/factory-assets/avatars/Avatar10.jpeg',
    'https://storage.googleapis.com/factory-assets/avatars/Avatar11.jpeg'

  ];
  selectedAvatar: string | null = null;
  submitting = false;

  constructor(
    private authService: AuthService,
    private workspacesService: WorkspacesService,
    private employeesService: AIEmployeesService,
    private notificationsService: NotificationsService,
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {
    this.generalForm = this.formBuilder.group({
      avatar: ['', Validators.required],
      role: ['', Validators.required],
      name: ['', Validators.required],
    });

  }

  ngOnInit() {
    const employee = this.employee
    this.generalForm.patchValue({
      avatar: employee?.avatar || '',
      role: employee?.role || '',
      name: employee?.name || ''
    });
    this.selectedAvatar = employee?.avatar || ''
  }

  get workspace() {
    return this.workspacesService.selectedWorkspace
  }

  get employee() {
    return this.employeesService.aiEmployee
  }

  selectAvatar(avatar: string) {
    this.selectedAvatar = avatar;
    this.generalForm.patchValue({ avatar: avatar });
    return this.updateData({ avatar });
  }

  hasInputError(inputName: string, errorName: string) {
    return (
      this.generalForm.get(inputName)?.invalid &&
      this.generalForm.get(inputName)?.touched &&
      this.generalForm.get(inputName)?.hasError(errorName)
    );
  }

  onDeleteEmployee() {
    const dialogData = new DialogComponent({ title: 'Delete Employee', content: 'Are you sure you want to remove this employee?', confirmText: 'Yes' });

    const dialogRef = this.dialog.open(DialogComponent, {
      maxWidth: "400px",
      data: dialogData
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.deleteEmployee();
      }
    });
  }

  onSubmit() {
    if (!this.generalForm.valid) return;
    return this.updateData({ ...this.generalForm.value });
  }

  private deleteEmployee() {
    return this.employeesService.delete(this.employee).subscribe({
      next: () => {
        this.notificationsService.show('Employee deleted successfully!');
        this.router.navigate(['workspaces', this.workspace._id]);
      },
      error: (error) => {
        console.log({ error });
        this.notificationsService.show('An error occurred while deleting the workspace, please try again.');
      },
    });
  }

  private updateData(data: Partial<IAIEmployee>) {
    return this.employeesService.update({ ...this.employee, ...data }).subscribe({
      next: (employee) => {
        this.employeesService.aiEmployee = employee;
        this.notificationsService.show('Employee updated successfully!');
        this.submitting = false;
      },
      error: () => {
        this.notificationsService.show(
          "Oops, it looks like there was an error... Please try again in a few minutes"
        );
        this.submitting = false;
      },
    });
  }


}
