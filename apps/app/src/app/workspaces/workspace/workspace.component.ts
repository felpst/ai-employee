import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WorkspacesService } from '../workspaces.service';

@Component({
  selector: 'cognum-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.scss'],
})
export class WorkspaceComponent {
  isLoading = false;

  constructor(
    private route: ActivatedRoute,
    private workspacesService: WorkspacesService
  ) {}

  get workspace() {
    return this.workspacesService.selectedWorkspace;
  }
}
