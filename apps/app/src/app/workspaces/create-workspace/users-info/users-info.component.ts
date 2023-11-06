import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { IUser, IWorkspace } from '@cognum/interfaces';
import { AuthService } from '../../../auth/auth.service';
import { WorkspacesService } from '../../workspaces.service';

@Component({
  selector: 'cognum-users-info',
  templateUrl: './users-info.component.html',
  styleUrls: ['./users-info.component.scss'],
})
export class UsersInfoComponent implements OnInit {
  @Input({ required: true }) workspace!: IWorkspace;
  @Output() updateWorkspaceEvent = new EventEmitter();
  @Output() changeStepEvent = new EventEmitter();
  teamForm!: FormGroup;
  photo: File | null = null;
  selectedImage: string | null = null;
  showWarning = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private workspacesService: WorkspacesService
  ) {
    this.teamForm = this.formBuilder.group({
      emails: ['', [Validators.required, this.emailListValidator]],
    });

    this.teamForm.valueChanges.subscribe(() => {
      this.showWarning = false;
    });
  }

  ngOnInit(): void {
    const user = this.authService.user;
    const users = this.workspace.users as IUser[];
    const _emails = users?.length
      ? users
          .map(({ email }) => email)
          .filter((email) => email !== user.email)
          .join(', ')
      : '';
    this.teamForm.get('emails')?.patchValue(_emails);
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

  hasInputError(inputName: string, errorName: string) {
    return (
      this.teamForm.get(inputName)?.invalid &&
      this.teamForm.get(inputName)?.touched &&
      this.teamForm.get(inputName)?.hasError(errorName)
    );
  }

  prevStep() {
    this.changeStepEvent.emit('WorkspaceInfo');
  }

  skipStep() {
    this.changeStepEvent.emit('EmployeeInfo');
  }

  onSubmit() {
    if (!this.teamForm.valid) return;
    const { emails } = this.teamForm.value;
    const _emails = emails.split(',').map((email: string) => email.trim());
    return this.workspacesService
      .update({ ...this.workspace, users: _emails })
      .subscribe((result) => {
        this.updateWorkspaceEvent.emit(result);
        this.changeStepEvent.emit('EmployeeInfo');
      });
  }
}
