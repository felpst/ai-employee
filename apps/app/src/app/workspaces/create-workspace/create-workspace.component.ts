import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IWorkspace } from '@cognum/interfaces';
import { AuthService } from '../../auth/auth.service';
import { LoadingService } from '../../layouts/loading/loading.service';
import { WorkspacesService } from '../workspaces.service';

export type Steps = 'WorkspaceInfo' | 'UsersInfo' | 'EmployeeInfo';

@Component({
  selector: 'cognum-create-workspace',
  templateUrl: './create-workspace.component.html',
  styleUrls: ['./create-workspace.component.scss'],
})
export class CreateWorkspaceComponent implements OnInit {
  workspace!: IWorkspace;
  currentStep: Steps = 'WorkspaceInfo';

  constructor(
    private workspaceService: WorkspacesService,
    private authService: AuthService,
    private loadingService: LoadingService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadingService.add('CreateWorkspaceLoading');
    const formData = new FormData();
    const data = {
      name: 'DEFAULT_WORKSPACE',
      description: 'DEFAULT_DESCRIPTION',
    };
    formData.append('json', JSON.stringify(data));
    this.workspaceService.createWorkspace(formData).subscribe(
      (response) => {
        this.workspace = response;
        this.loadingService.remove('CreateWorkspaceLoading');
      },
      (error) => {
        console.error('Error creating workspace', { error });
      }
    );
  }

  updateWorkspace(workspace: IWorkspace) {
    this.workspace = workspace;
  }

  changeStep(step: any) {
    this.currentStep = step;
  }

  onLogOut() {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/auth']);
      },
    });
  }

  get user() {
    return this.authService.user;
  }

  get isLoading() {
    return this.loadingService.isLoading;
  }
}
