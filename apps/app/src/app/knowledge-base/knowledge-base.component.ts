import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { IKnowledge } from '@cognum/interfaces';
import { KnowledgeBaseService } from './knowledge-base.service';
import { KnowledgeFormComponent } from './knowledge-form/knowledge-form.component';

@Component({
  selector: 'cognum-knowledge-base',
  templateUrl: './knowledge-base.component.html',
  styleUrls: ['./knowledge-base.component.scss'],
})
export class KnowledgeBaseComponent implements OnInit {
  knowledgeBase: IKnowledge[] = [];
  knowledgeBaseFiltered: IKnowledge[] = [];
  searchText = '';

  constructor(
    private knowledgeBaseService: KnowledgeBaseService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadKnowledgeBase();
  }

  onForm(knowledge?: IKnowledge) {
    const dialogRef = this.dialog.open(KnowledgeFormComponent, {
      width: '640px',
      data: { knowledge },
    });
    dialogRef.afterClosed().subscribe((res) => {
      this.loadKnowledgeBase();
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

  loadKnowledgeBase() {
    this.knowledgeBaseService.list().subscribe((res) => {
      this.knowledgeBase = res;
      this.clearSearch();
    });
  }
}
