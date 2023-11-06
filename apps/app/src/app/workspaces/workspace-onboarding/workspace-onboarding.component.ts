import { Component } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Step } from '../../shared/stepper/stepper.component';
import { WorkspacesService } from '../workspaces.service';

@Component({
  selector: 'cognum-workspace-onboarding',
  templateUrl: './workspace-onboarding.component.html',
  styleUrls: ['./workspace-onboarding.component.scss'],
})
export class WorkspaceOnboardingComponent {
  steps: Step[] = [
    { title: 'workspace', routerLink: 'workspace' },
    { title: 'your team', routerLink: 'your-team' },
    { title: 'ai employee', routerLink: 'ai-employee' },
  ]

  constructor(
    public workspacesService: WorkspacesService,
    private authService: AuthService
  ) {}

  get user() {
    return this.authService.user;
  }

}
