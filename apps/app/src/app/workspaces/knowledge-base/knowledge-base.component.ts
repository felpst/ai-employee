/* eslint-disable @typescript-eslint/no-empty-function */
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { ActivatedRoute } from '@angular/router';
import { IKnowledge, IWorkspace } from '@cognum/interfaces';
import { AuthService } from '../../auth/auth.service';
import { NotificationsService } from '../../services/notifications/notifications.service';
import { DialogComponent } from '../../shared/dialog/dialog.component';
import { WorkspacesService } from '../workspaces.service';
import { KnowledgeBaseService } from './knowledge-base.service';
import { KnowledgeFormComponent } from './knowledge-form/knowledge-form.component';
import { KnowledgeModalComponent } from './knowledge-modal/knowledge-modal.component';

@Component({
  selector: 'cognum-knowledge-base',
  templateUrl: './knowledge-base.component.html',
  styleUrls: ['./knowledge-base.component.scss'],
})
export class KnowledgeBaseComponent implements OnInit {
  workspace!: IWorkspace | null;
  knowledgeBase: IKnowledge[] = [];
  knowledgeBaseFiltered: IKnowledge[] = [];
  searchText = '';

  sortingType: 'newFirst' | 'oldFirst' | 'mix' = 'newFirst';
  sortingDirection: 'asc' | 'desc' = 'desc';
  activeButton = 'newFirst';
  isLoading = true;
  workspaceData = '@cognum/selected-workspace';

  constructor(
    private route: ActivatedRoute,
    private knowledgeBaseService: KnowledgeBaseService,
    private authService: AuthService,
    private workspacesService: WorkspacesService,
    private notificationsService: NotificationsService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    const workspaces = this.workspacesService.workspaces;
    if (workspaces.size === 0) {
      return this.onLoadList();
    } else {
      this.workspace =
        this.workspacesService.workspaces.get(this.workspaceId) || null;
      this.loadKnowledgeBase(this.workspaceId);
      this.isLoading = false;
    }
  }

  onLoadList() {
    this.workspacesService.list().subscribe((data) => {
      const workspace = data.get(this.workspaceId) || null;
      console.log({ data, workspace });
      this.workspace = workspace;
      this.loadKnowledgeBase(this.workspaceId);
      this.isLoading = false;
    });
  }

  getWorkspace(workspaceId: string) {
    this.workspacesService
      .get(workspaceId)
      .subscribe((workspace) => (this.workspace = workspace));
  }

  onForm(knowledge?: IKnowledge) {
    const dialogRef = this.dialog.open(KnowledgeFormComponent, {
      width: '640px',
      data: { knowledge, workspace: this.workspace },
    });
    dialogRef.afterClosed().subscribe((res) => {
      this.loadKnowledgeBase(this.workspaceId);
    });
  }

  onSearch(event: any) {
    this.searchText = event.target.value;
    this.knowledgeBaseFiltered = this.knowledgeBase.filter((knowledge) => {
      return knowledge.data.includes(this.searchText);
    });
  }

  clearSearch() {
    this.searchText = '';
    this.knowledgeBaseFiltered = this.knowledgeBase;
  }

  loadKnowledgeBase(workspaceId: string) {
    return this.knowledgeBaseService
      .getAllFromWorkspace(workspaceId)
      .subscribe((knowledges) => {
        this.knowledgeBase = knowledges;
        this.clearSearch();

        this.sortKnowledgeBase(this.activeButton);
      });
  }

  userHasEditorPermission(knowledge: IKnowledge): boolean {
    return this.knowledgeBaseService.userPermission(
      knowledge,
      this.authService.user?._id
    );
  }

  editKnowledge(knowledge: IKnowledge) {
    this.onForm(knowledge);
  }

  deleteKnowledge(knowledge: IKnowledge) {
    this.knowledgeBaseService.delete(knowledge).subscribe((res) => {
      this.loadKnowledgeBase(this.workspaceId);
      this.notificationsService.show('Knowledge deleted!');
    });
  }

  openDeleteConfirmationDialog(knowledge: IKnowledge) {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        title: 'Delete Confirmation',
        content: 'Are you sure you want to delete this knowledge?',
        confirmText: 'Delete',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.deleteKnowledge(knowledge);
      }
    });
  }

  openKnowledgeModal(knowledge: IKnowledge): void {
    const dialogRef = this.dialog.open(KnowledgeModalComponent, {
      width: '60%',
      height: '80%',
      data: knowledge,
    });

    dialogRef.afterClosed().subscribe(() => {});
  }

  updatedTimeDifference(updatedAt: Date | undefined): string {
    if (!updatedAt) {
      return 'N/A';
    }

    const updatedAtDate = new Date(updatedAt);
    const now = new Date();
    const diffMilliseconds = now.getTime() - updatedAtDate.getTime();
    const diffMinutes = Math.floor(diffMilliseconds / (1000 * 60));
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMinutes < 60) {
      return `${diffMinutes} minutes ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hours ago`;
    } else {
      return `${diffDays} days ago`;
    }
  }

  sortKnowledgeBase(sortingCriterion: string) {
    if (sortingCriterion === 'newFirst') {
      this.sortingDirection = 'desc';
    } else if (sortingCriterion === 'oldFirst') {
      this.sortingDirection = 'asc';
    } else if (sortingCriterion === 'mix') {
      this.knowledgeBaseFiltered.sort(() => Math.random() - 0.5);
    } else {
      this.sortingDirection = 'desc';
    }

    if (sortingCriterion !== 'mix') {
      this.knowledgeBaseFiltered.sort((a: IKnowledge, b: IKnowledge) => {
        if (a.createdAt && b.createdAt) {
          const dateA = new Date(a.createdAt);
          const dateB = new Date(b.createdAt);

          const sortOrder = this.sortingDirection === 'asc' ? 1 : -1;

          if (dateA < dateB) {
            return -sortOrder;
          }
          if (dateA > dateB) {
            return sortOrder;
          }
        }
        return 0;
      });
    }
  }

  onButtonClick(button: string) {
    this.activeButton = button;
    this.sortKnowledgeBase(button);
  }

  get workspaceId() {
    return this.workspacesService.selectedWorkspace?._id || '';
  }
}
