import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { KnowledgeBaseService } from '../knowledge-base.service';

interface Message {
  source: 'human' | 'ai',
  content: string;
}
@Component({
  selector: 'cognum-knowledge-ask',
  templateUrl: './knowledge-ask.component.html',
  styleUrls: ['./knowledge-ask.component.scss'],
})
export class KnowledgeAskComponent {
  @ViewChild('chatContainer') private chatContainer!: ElementRef;

  knowledgeId: string | undefined;
  workspaceId!: string;
  messages: Message[] = [];
  loadingResponse: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<KnowledgeAskComponent>,
    private knowledgeService: KnowledgeBaseService,
    @Inject(MAT_DIALOG_DATA)
    private data: {
      knowledgeId?: string;
      workspaceId: string;
    }) {
    this.knowledgeId = this.data.knowledgeId;
    this.workspaceId = this.data.workspaceId;
  }

  ask(event: Event) {
    const question =
      (event.target as unknown as { value: string; }).value;
    if (!question) return;

    this.addMessage({ source: 'human', content: question });
    (event.target as unknown as { value: string; }).value = '';
    this.loadingResponse = true;

    const observable = this.knowledgeId
      ? this.knowledgeService.askByKnowledge(question, this.knowledgeId)
      : this.knowledgeService.askByWorkspace(question, this.workspaceId);

    observable.subscribe(result => {
      this.addMessage({ source: 'ai', content: result.text });
      this.loadingResponse = false;
    });
  }

  private async addMessage(message: Message) {
    this.messages.push(message);
    this.scrollChatToBottom();
  }

  private async scrollChatToBottom() {
    try {
      const currentHeight = this.chatContainer.nativeElement.scrollHeight;
      let attempts = 0;
      while (currentHeight === this.chatContainer.nativeElement.scrollHeight && attempts < 10) { // element takes a little time to update scroll height
        attempts++;
        await new Promise(r => setTimeout(r, 1));
      }
      this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
    } catch (_) { }
  }

  closeModal() {
    this.dialogRef.close();
  }
}
