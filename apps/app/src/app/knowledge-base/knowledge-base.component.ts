import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { ActivatedRoute } from '@angular/router';
import { IKnowledge, IWorkspace } from '@cognum/interfaces';
import { NotificationsService } from '../services/notifications/notifications.service';
import { DialogComponent } from '../shared/dialog/dialog.component';
import { WorkspacesService } from '../workspaces/workspaces.service';
import { KnowledgeBaseService } from './knowledge-base.service';
import { KnowledgeFormComponent } from './knowledge-form/knowledge-form.component';
import { KnowledgeModalComponent } from './knowledge-modal/knowledge-modal.component';

@Component({
  selector: 'cognum-knowledge-base',
  templateUrl: './knowledge-base.component.html',
  styleUrls: ['./knowledge-base.component.scss'],
})
export class KnowledgeBaseComponent {
  workspace!: IWorkspace;
  knowledgeBase: IKnowledge[] = [];
  knowledgeBaseFiltered: IKnowledge[] = [];
  searchText = '';

  sortingType: 'newFirst' | 'oldFirst' | 'mix' = 'newFirst';
  sortingDirection: 'asc' | 'desc' = 'desc';
  activeButton: string = 'newFirst';
  
  constructor(
    private route: ActivatedRoute,
    private knowledgeBaseService: KnowledgeBaseService,
    private workspacesService: WorkspacesService,
    private notificationsService: NotificationsService,
    private dialog: MatDialog
  ) {
    this.route.params.subscribe((params) => {
      this.getWorkspace(params['workspaceId']);
      this.loadKnowledgeBase(params['workspaceId']);
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
      this.loadKnowledgeBase(this.workspace._id);
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
    console.log(this.knowledgeBaseFiltered)
  }

  loadKnowledgeBase(workspaceId: string) {
    return this.knowledgeBaseService
      .getAllFromWorkspace(workspaceId)
      .subscribe((knowledges) => {
        this.knowledgeBase = knowledges;
        this.clearSearch();
      });
  }

  editKnowledge(knowledge: IKnowledge) {
    this.onForm(knowledge);
  }

  deleteKnowledge(knowledge: IKnowledge) {
    this.knowledgeBaseService
      .delete(knowledge)
      .subscribe((res) => {
        this.loadKnowledgeBase(this.workspace._id);
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

    dialogRef.afterClosed().subscribe(() => {
    });
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

}
