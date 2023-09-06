import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { IKnowledge } from '@cognum/interfaces';
import { KnowledgeBaseService } from './knowledge-base.service';

@Component({
  selector: 'cognum-knowledge-base',
  templateUrl: './knowledge-base.component.html',
  styleUrls: ['./knowledge-base.component.scss'],
})
export class KnowledgeBaseComponent implements OnInit {
  knowledgeBase: IKnowledge[] = [];
  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private knowledgeBaseService: KnowledgeBaseService
  ) {
    this.form = this.formBuilder.group({
      data: [''],
    });
  }

  ngOnInit(): void {
    this.loadKnwoledgeBase();
  }

  loadKnwoledgeBase() {
    this.knowledgeBaseService.list().subscribe((res) => {
      this.knowledgeBase = res;
    });
  }

  onSubmit() {
    const data = this.form.value;
    this.knowledgeBaseService.create(data).subscribe((res) => {
      console.log(res);
      this.loadKnwoledgeBase();
    });
  }

  onEdit(item: IKnowledge) {
    this.knowledgeBaseService.update(item).subscribe((res) => {
      console.log('[UPDATED]', res);
    });
  }

  onDelete(item: IKnowledge) {
    this.knowledgeBaseService.delete(item).subscribe((res) => {
      console.log('[DELETED]', res);
      this.loadKnwoledgeBase();
    });
  }
}
