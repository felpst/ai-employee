import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IWorkspace } from '@cognum/interfaces';
import { WorkspacesService } from '../workspaces.service';

@Component({
  selector: 'cognum-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.scss'],
})
export class WorkspaceComponent implements OnInit {
  workspace!: IWorkspace;
  workspaceId!: string;

  constructor(
    private route: ActivatedRoute,
    private workspacesService: WorkspacesService
  ) {
    route.params.subscribe((params) => {
      this.workspaceId = params['id'];
    });
  }
  ngOnInit(): void {
    this.getWorkspace();
  }

  getWorkspace() {
    return this.workspacesService
      .get(this.workspaceId)
      .subscribe((workspace) => {
        console.log({ workspace });
        this.workspace = workspace;
      });
  }
}
