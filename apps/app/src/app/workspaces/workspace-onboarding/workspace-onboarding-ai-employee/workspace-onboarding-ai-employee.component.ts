import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { WorkspacesService } from '../../workspaces.service';

@Component({
  selector: 'cognum-workspace-onboarding-ai-employee',
  templateUrl: './workspace-onboarding-ai-employee.component.html',
  styleUrls: ['./workspace-onboarding-ai-employee.component.scss'],
})
export class WorkspaceOnboardingAIEmployeeComponent {
  constructor(
    private workspaceService: WorkspacesService,
    private router: Router
  ) {}
  get workspace() {
    return this.workspaceService.selectedWorkspace;
  }
  onFinish(event: string) {
    this.router.navigate(['/workspaces', this.workspace._id]);
  }
}
