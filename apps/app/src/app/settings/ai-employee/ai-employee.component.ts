
import { Component, OnInit } from '@angular/core';
import {

  FormBuilder,
  Validators

} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationsService } from '../../services/notifications/notifications.service';
import { EmployeeService } from '../../workspaces/ai-employee/ai-employee.service';
import { IAIEmployee } from '@cognum/interfaces';


@Component({
  selector: 'cognum-ai-employee',
  templateUrl: './ai-employee.component.html',
  styleUrls: ['./ai-employee.component.scss'],
})
export class AiEmployeeComponentSettings implements OnInit {
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
    private notificationsService: NotificationsService,
    private aiEmployeeService: EmployeeService
  ) {
    this.updateForm.valueChanges.subscribe(() => {
      this.showUpdateError = false;
    });

  }

  openDeleteAccountModal() {
    this.showDeleteConfirmation = true;
  }


  selectAvatar(avatarPath: string) {

    this.selectedAvatar = avatarPath;

    this.isAvatarSelected = true;

  }


  ngOnInit() {
    this.route.params.subscribe(params => {
      const employeeId = params['id'];
      console.log(employeeId);
      this.aiEmployeeService.getById(employeeId).subscribe({
        next: (response) => {
          this.name = response.name;
          this.role = response.role;
        },
      });
    });
  }

  confirmDeleteAccount() {


    const employeeId = this.route.snapshot.params['id'];
    const updateData: Partial<IAIEmployee> = {
      _id: employeeId,
    };
    console.log(employeeId);
    this.aiEmployeeService.delete(updateData).subscribe({
      next: () => {
        this.router.navigate(['/'], { relativeTo: this.route });
      },
    });


    this.showDeleteConfirmation = false;
  }

  cancelDeleteAccount() {
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

    this.aiEmployeeService.update(updateData).subscribe({
      next: () => {
        this.notificationsService.show('Successfully changed data!');
      },
    });
  }

  selectedItem: number | null = 1;

  selectItem(itemNumber: number): void {
    this.selectedItem = itemNumber;
  }
}
