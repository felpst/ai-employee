import {
  AfterViewChecked,
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IFeedback } from '@cognum/interfaces';
import { MessagesService } from '../../../../services/messages/messages.service';
import { NotificationsService } from '../../../../services/notifications/notifications.service';

type UpdateFeedback = {
  _id: string;
  messageId: string;
  isPositive: boolean;
  comment?: string;
};

@Component({
  selector: 'cognum-feedback-form',
  templateUrl: './feedback-form.component.html',
  styleUrls: ['./feedback-form.component.scss'],
})
export class FeedbackFormComponent implements OnInit, AfterViewChecked {
  @ViewChild('inputSuggestions', { static: true })
  private inputSuggestions!: ElementRef;
  form!: FormGroup;
  suggestions = '';

  constructor(
    private dialogRef: MatDialogRef<FeedbackFormComponent>,
    private notificationsService: NotificationsService,
    private messagesService: MessagesService,
    @Inject(MAT_DIALOG_DATA)
    private data: { feedback: IFeedback; messageId: string }
  ) {
    this.form = new FormGroup({
      suggestions: new FormControl(this.suggestions, []),
    });
  }
  ngAfterViewChecked(): void {
    this.inputSuggestions.nativeElement.focus();
  }
  ngOnInit(): void {
    const { feedback } = this.data;
    this.fillFeedbackModal(feedback);
  }

  onSubmit() {
    const { valid, value } = this.form;
    if (!valid) return;
    const { suggestions } = value;
    const {
      feedback: { isPositive, _id },
      messageId,
    } = this.data;
    if (suggestions)
      this.updateMessage({ _id, isPositive, messageId, comment: suggestions });
    this.dialogRef.close();
    this.notificationsService.show('Feedback sent!');
  }

  private fillFeedbackModal(message: IFeedback): void {
    const { isPositive } = message;
    const feedbackIcon = document.getElementById('feedback-icon');
    if (feedbackIcon) {
      feedbackIcon.className = '';
      const common = ['feedback-icon', 'like', 'fa'];
      const styles = isPositive
        ? ['fa-thumbs-o-up', 'feedback-up']
        : ['fa-thumbs-o-down', 'feedback-down'];
      feedbackIcon.classList.add(...common, ...styles);
    }
  }

  private updateMessage(message: UpdateFeedback) {
    return this.messagesService.updateFeedback(message).subscribe((_) => _);
  }
}
