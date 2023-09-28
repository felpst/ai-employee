import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { IKnowledge, IWorkspace } from '@cognum/interfaces';
import { WorkspacesService } from '../workspaces/workspaces.service';
import { KnowledgeBaseService } from './knowledge-base.service';
import { KnowledgeFormComponent } from './knowledge-form/knowledge-form.component';

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

  constructor(
    private route: ActivatedRoute,
    private knowledgeBaseService: KnowledgeBaseService,
    private workspacesService: WorkspacesService,
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
  }

  loadKnowledgeBase(workspaceId: string) {
    return this.knowledgeBaseService
      .getAllFromWorkspace(workspaceId)
      .subscribe((knowledges) => {
        this.knowledgeBase = knowledges;
        this.clearSearch();
      });
  }
}
