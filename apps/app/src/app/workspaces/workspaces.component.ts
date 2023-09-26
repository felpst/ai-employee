import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { IWorkspace } from '@cognum/interfaces';
import { DialogComponent } from '../shared/dialog/dialog.component';
import { CreateWorkspaceFormComponent } from './create-workspace-form/create-workspace-form.component';
import { WorkspacesService } from './workspaces.service';

@Component({
  selector: 'cognum-workspaces',
  templateUrl: './workspaces.component.html',
  styleUrls: ['./workspaces.component.scss'],
})
export class WorkspacesComponent implements OnInit {
  constructor(
    private router: Router,
    private workspacesService: WorkspacesService,
    private dialog: MatDialog
  ) {}

  get selectedWorkspace(): string | null {
    return this.workspacesService.selectedWorkspace;
  }

  ngOnInit() {
    this.onLoadList();
  }

  get workspaces() {
    return Array.from(this.workspacesService.workspaces.values()).sort(
      (a: IWorkspace, b: IWorkspace) => {
        return (
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
        );
      }
    );
  }

  onLoadList() {
    this.workspacesService.list().subscribe();
  }

  onNewWorkspace() {
    const dialogRef = this.dialog.open(CreateWorkspaceFormComponent, {
      width: '600px',
      data: { feedback: '', messageId: '' },
    });
    dialogRef.afterClosed().subscribe((res) => {
      this.onLoadList();
      this.router.navigate(['/workspaces']);
    });
  }

  onWorkspace(workspace: IWorkspace) {
    this.workspacesService.selectedWorkspace = workspace._id;
    this.router.navigate(['/workspaces', workspace._id]);
  }

  onChat(workspace: IWorkspace) {
    const { _id } = workspace;
    this.router.navigate(['/chats', _id]);
  }

  onEdit(workspace: IWorkspace) {
    const dialogRef = this.dialog.open(CreateWorkspaceFormComponent, {
      width: '600px',
      data: { workspace },
    });
    dialogRef.afterClosed().subscribe((res) => {
      this.onLoadList();
      this.router.navigate(['/workspaces']);
    });
  }

  onDelete(workspace: IWorkspace) {
    this.dialog
      .open(DialogComponent, {
        data: {
          title: 'Delete Workspace',
          content: 'Are you sure you want to delete this workspace?',
          confirmText: 'Delete',
        },
      })
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          this.workspacesService.delete(workspace).subscribe({
            next: () => {
              this.onLoadList();
              this.router.navigate(['/workspaces']);
            },
          });
        }
      });
  }
}
