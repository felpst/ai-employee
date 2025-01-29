/* eslint-disable @typescript-eslint/no-empty-function */
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { ActivatedRoute } from '@angular/router';
import { IKnowledge, IWorkspace, KnowledgeTypeEnum } from '@cognum/interfaces';
import { AuthService } from '../../auth/auth.service';
import { NotificationsService } from '../../services/notifications/notifications.service';
import { WorkspacesService } from '../workspaces.service';
import { KnowledgeAskComponent } from './knowledge-ask/knowledge-ask.component';
import { KnowledgeBaseService } from './knowledge-base.service';
import { KnowledgeChooseFormDialogComponent } from './knowledge-choose-form-dialog/knowledge-choose-form-dialog.component';
import { KnowledgeFormComponent } from './knowledge-form/knowledge-form.component';
import { KnowledgeModalComponent } from './knowledge-modal/knowledge-modal.component';

@Component({
  selector: 'cognum-knowledge-base',
  templateUrl: './knowledge-base.component.html',
  styleUrls: ['./knowledge-base.component.scss'],
})
export class KnowledgeBaseComponent implements OnInit {
  workspace!: IWorkspace;
  knowledgeBases: IKnowledge[] = [];
  searchText = '';

  sortingType: 'new' | 'old' | 'acess' = 'new';
  sortingDirection: 'asc' | 'desc' = 'desc';
  activeButton = 'new';
  isLoading = true;
  workspaceData = '@cognum/selected-workspace';

  constructor(
    private route: ActivatedRoute,
    private knowledgeBaseService: KnowledgeBaseService,
    private authService: AuthService,
    private workspacesService: WorkspacesService,
    private notificationsService: NotificationsService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      this.knowledgeBases = data['0'] as IKnowledge[];
      this.workspace = this.workspacesService.selectedWorkspace;
      this.isLoading = false;
    });
  }

  public get types() {
    return KnowledgeTypeEnum;
  }

  onAsk(knowledge?: IKnowledge) {
    this.dialog.open(KnowledgeAskComponent, {
      width: '540px',
      maxHeight: '600px',
      position: {
        top: '100px'
      },
      data: {
        workspaceId: this.workspace._id,
        knowledgeId: knowledge?._id
      }
    });
  }

  onForm(knowledge?: IKnowledge) {
    const chooseFormDialog = this.dialog.open(KnowledgeChooseFormDialogComponent);
    const formWidth: Record<KnowledgeTypeEnum, string> = {
      doc: '640px',
      file: '420px',
      html: '500px'
    };

    chooseFormDialog.afterClosed().subscribe((pick: KnowledgeTypeEnum) => {
      if (pick) {
        const dialogRef = this.dialog.open(KnowledgeFormComponent, {
          width: formWidth[pick],
          data: { knowledge, workspace: this.workspace, inputType: pick },
        });

        dialogRef.afterClosed().subscribe((res) => {
          if (res) {
            this.knowledgeBaseService.getAllFromWorkspace(this.workspace._id).subscribe((knowledgeBase) => {
              this.knowledgeBases = knowledgeBase;
            });
          }
        });
      }
    });
  }

  onSearch(event: any) {
    const searchText = event.trim().toLowerCase();

    if (!searchText) {
      this.loadKnowledgeBase();
      return;
    }

    this.searchText = searchText;
    this.knowledgeBases = this.knowledgeBases.filter(knowledge =>
      knowledge.data?.toLowerCase().includes(searchText)
    );
  }

  clearSearch() {
    this.searchText = '';
    this.loadKnowledgeBase();
  }

  loadKnowledgeBase() {
    const workspaceId = this.workspace?._id;
    return this.knowledgeBaseService
      .getAllFromWorkspace(workspaceId)
      .subscribe((knowledges) => {
        this.knowledgeBases = knowledges;
        this.sortKnowledgeBase(this.activeButton);
      });
  }

  userHasEditorPermission(knowledge: IKnowledge): boolean {
    return this.knowledgeBaseService.userPermission(
      knowledge,
      this.authService.user?._id
    );
  }

  handleKnowledgeEdited() {
    this.loadKnowledgeBase();
  }

  handleKnowledgeDeleted() {
    this.loadKnowledgeBase();
  }

  openKnowledgeModal(knowledge: IKnowledge): void {
    const dialogRef = this.dialog.open(KnowledgeModalComponent, {
      width: '60%',
      height: '80%',
      data: knowledge,
    });

    dialogRef.afterClosed().subscribe(() => { });
  }

  updatedTimeDifference(updatedAt: Date | undefined): string {
    if (!updatedAt) {
      return 'N/A';
    }

    const diffMilliseconds = new Date().getTime() - new Date(updatedAt).getTime();
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
    if (sortingCriterion === 'acess') {
      this.knowledgeBases.sort(() => Math.random() - 0.5);
      return;
    }

    this.sortingDirection = sortingCriterion === 'old' ? 'asc' : 'desc';

    this.knowledgeBases.sort((a: IKnowledge, b: IKnowledge) => {
      if (a.createdAt && b.createdAt) {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);

        const sortOrder = this.sortingDirection === 'asc' ? 1 : -1;

        return dateA < dateB ? -sortOrder : dateA > dateB ? sortOrder : 0;
      }
      return 0;
    });
  }

  onButtonClick(button: string) {
    this.activeButton = button;
    this.sortKnowledgeBase(button);
  }

}
