
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IAIEmployee } from '@cognum/interfaces';
import { AuthService } from '../../../auth/auth.service';
import { NotificationsService } from '../../../services/notifications/notifications.service';
import { Step } from '../../../shared/stepper/stepper.component';
import { AIEmployeesService } from '../ai-employees.service';


@Component({
  selector: 'cognum-ai-employee-settings',
  templateUrl: './ai-employee-settings.component.html',
  styleUrls: ['./ai-employee-settings.component.scss'],
})
export class AIEmployeeSettingsComponent implements OnInit {
  navs: Step[] = [
    { title: 'General', routerLink: 'general' }
  ]
  name = '';
  role = '';
  updateForm = this.formBuilder.group({
    name: [this.name, [Validators.required]],
    role: [this.role, [Validators.required]],

  });
  submitting = false;
  showUpdateError = false;
  errors = [];
  showDeleteConfirmation = false;
  image = '';
  selectedImage: string | null = null;
  workspaceId: string | null = null;
  selectedAvatar: string | null = null;
  isAvatarSelected = false;
  availableAvatars = ['../../../assets/icons/avatar(2).svg'];

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private notificationsService: NotificationsService,
    private aiAIEmployeesService: AIEmployeesService
  ) {
    this.updateForm.valueChanges.subscribe(() => {
      this.showUpdateError = false;
    });

  }

  openDeleteAiEmployeeModal() {
    this.showDeleteConfirmation = true;
  }

  get userName() {
    return this.authService.user ? this.authService.user.name : '';
  }

  get photo() {
    return this.authService.user ? this.authService.user.photo : '';
  }

  selectAvatar(avatarPath: string) {

    this.selectedAvatar = avatarPath;

    this.isAvatarSelected = true;

  }


  ngOnInit() {
    this.route.params.subscribe(params => {
      const employeeId = params['id'];
      this.aiAIEmployeesService.get(employeeId).subscribe({
        next: (response) => {
          this.name = response.name;
          this.role = response.role;
        },
      });
    });
  }

  confirmDeleteAiEmployee() {


    const employeeId = this.route.snapshot.params['id'];
    const updateData: Partial<IAIEmployee> = {
      _id: employeeId,
    };
    this.aiAIEmployeesService.delete(updateData).subscribe({
      next: () => {
        this.router.navigate(['/'], { relativeTo: this.route });
      },
    });


    this.showDeleteConfirmation = false;
  }

  cancelDeleteAiEmployee() {
    this.showDeleteConfirmation = false;
  }

  async onSubmit() {
    if (!this.updateForm.valid) return;
    this.submitting = true;
    const employeeId = this.route.snapshot.params['id'];
    const name = this.updateForm.get('name')?.value as string;
    const role = this.updateForm.get('role')?.value as string;

    const updateData: Partial<IAIEmployee> = { _id: employeeId };
    if (name) {
      updateData.name = name;
    }
    if (role) {
      updateData.role = role;
    }

    this.aiAIEmployeesService.update(updateData).subscribe({
      next: () => {
        this.notificationsService.show('Successfully changed data!');
      },
    });
  }

  selectedItem: number | null = 1;

  selectItem(itemNumber: number): void {
    this.selectedItem = itemNumber;
  }

  get employee() {
    return this.aiAIEmployeesService.aiEmployee;
  }
}
