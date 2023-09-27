import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IWorkspace } from '@cognum/interfaces';
import { WorkspacesService } from '../workspaces.service';

@Component({
  selector: 'cognum-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.scss'],
})
export class WorkspaceComponent {
  workspace!: IWorkspace;
  workspaceId!: string;
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private workspacesService: WorkspacesService
  ) {
    this.route.params.subscribe((params) => {
      this.workspaceId = params['id'];
      this.getWorkspace();
    });
  }

  getWorkspace() {
    this.isLoading = true;
    return this.workspacesService
      .get(this.workspaceId)
      .subscribe((workspace) => {
        this.workspace = workspace;
        this.isLoading = false;
      });
  }
}
