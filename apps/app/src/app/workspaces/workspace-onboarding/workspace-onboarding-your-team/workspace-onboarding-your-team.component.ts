import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IUser } from '@cognum/interfaces';
import { AuthService } from '../../../auth/auth.service';
import { WorkspacesService } from '../../workspaces.service';

@Component({
  selector: 'cognum-workspace-onboarding-your-team',
  templateUrl: './workspace-onboarding-your-team.component.html',
  styleUrls: ['./workspace-onboarding-your-team.component.scss'],
})
export class WorkspaceOnboardingYourTeamComponent implements OnInit {
  teamForm!: FormGroup;
  showWarning = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private workspacesService: WorkspacesService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.teamForm = this.formBuilder.group({
      emails: ['', [this.emailListValidator]],
    });

    this.teamForm.valueChanges.subscribe(() => {
      this.showWarning = false;
    });
  }

  ngOnInit(): void {
    const user = this.authService.user;
    const users = this.workspace.users as IUser[];
    const filtered = users
      .map(({ email }) => email)
      .filter((email) => email !== user.email);
    const _emails = filtered?.length ? filtered.join(', ') : '';
    this.teamForm.get('emails')?.patchValue(_emails);
  }

  emailListValidator(control: FormControl): { [key: string]: any } | null {
    const value = control.value as string;
    if (!value) return null;
    const emails: string[] = value.split(',').map((email) => email.trim());
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

  onSubmit() {
    const { emails } = this.teamForm.value;
    const _emails = emails
      .split(',')
      .map((email: string) => email.trim())
      .filter((value: string) => !!value);

    if (_emails.length) {
      return this.workspacesService
        .update({ ...this.workspace, users: _emails })
        .subscribe((workspace) => {
          this.workspacesService.selectedWorkspace = workspace;
          this.router.navigate(['../ai-employee'], {
            relativeTo: this.activatedRoute,
          });
        });
    } else {
      return this.router.navigate(['../ai-employee'], {
        relativeTo: this.activatedRoute,
      });
    }
  }

  get workspace() {
    return this.workspacesService.selectedWorkspace;
  }
}
