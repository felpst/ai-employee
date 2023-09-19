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
import { MessagesService } from '../../../services/messages/messages.service';
import { NotificationsService } from '../../../services/notifications/notifications.service';

type MessageUpdate = {
  _id: string;
  rating: string;
  suggestions?: string;
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
    private data: { message: MessageUpdate }
  ) {
    this.form = new FormGroup({
      suggestions: new FormControl(this.suggestions, []),
    });
  }
  ngAfterViewChecked(): void {
    this.inputSuggestions.nativeElement.focus();
  }
  ngOnInit(): void {
    const { message } = this.data;
    this.fillFeedbackModal(message);
  }

  onSubmit() {
    const { valid, value } = this.form;
    if (!valid) return;
    const { suggestions } = value;
    const {
      message: { _id, rating },
    } = this.data;
    if (suggestions) this.updateMessage({ _id, rating, suggestions });
    this.dialogRef.close();
    this.notificationsService.show('Feedback sent!');
  }

  private fillFeedbackModal(message: MessageUpdate): void {
    const { rating } = message;
    const feedbackIcon = document.getElementById('feedback-icon');
    if (feedbackIcon) {
      feedbackIcon.className = '';
      const common = ['feedback-icon', 'like', 'fa'];
      const styles =
        rating === 'THUMBSUP'
          ? ['fa-thumbs-o-up', 'feedback-up']
          : ['fa-thumbs-o-down', 'feedback-down'];
      feedbackIcon.classList.add(...common, ...styles);
    }
  }

  private updateMessage(message: MessageUpdate) {
    return this.messagesService.update(message).subscribe((_) => _);
  }
}
