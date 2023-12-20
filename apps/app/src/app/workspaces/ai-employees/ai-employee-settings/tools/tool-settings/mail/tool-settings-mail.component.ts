import { AfterViewInit, ChangeDetectorRef, Component, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToolsHelper } from '@cognum/helpers';
import { IToolSettings } from '@cognum/interfaces';
import { AIToolSettingsMailReaderComponent } from './mail-reader/tool-settings-mail-reader.component';
import { AIToolSettingsMailSenderComponent } from './mail-sender/tool-settings-mail-sender.component';
import { MailToolSettings } from '../../../../../../../../../../libs/tools/src/lib/tools/mail/mail.interfaces';

@Component({
  selector: 'cognum-ai-tool-settings-mail',
  templateUrl: './tool-settings-mail.component.html',
  styleUrls: ['./tool-settings-mail.component.scss'],
})
export class AIToolSettingsMailComponent implements AfterViewInit {
  @ViewChild(AIToolSettingsMailSenderComponent) mailSender!: AIToolSettingsMailSenderComponent;
  @ViewChild(AIToolSettingsMailReaderComponent) mailReader!: AIToolSettingsMailReaderComponent;
  formGroup!: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { tool: IToolSettings; },
    private dialogRef: MatDialogRef<AIToolSettingsMailComponent>,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    this.initializeFormGroup();
  }

  initializeFormGroup() {
    this.formGroup = this.formBuilder.group({
      subTools: this.formBuilder.group({
        mailSenderSelected: new FormControl(this.data.tool.options?.subTools?.mailSenderSelected !== undefined ? this.data.tool.options.subTools.mailSenderSelected : true),
        mailReaderSelected: new FormControl(this.data.tool.options?.subTools?.mailReaderSelected !== undefined ? this.data.tool.options.subTools.mailReaderSelected : true),
        mailSender: this.formBuilder.group({}),
        mailReader: this.formBuilder.group({}),
      }),
    });
  }

  ngAfterViewInit() {
    this.subscribeToSelectionChange('subTools.mailSenderSelected', 'subTools.mailSender', this.mailSender);
    this.subscribeToSelectionChange('subTools.mailReaderSelected', 'subTools.mailReader', this.mailReader);
    this.cdr.detectChanges();
  }

  subscribeToSelectionChange(selectionControlName: string, formGroupName: string, component: AIToolSettingsMailSenderComponent | AIToolSettingsMailReaderComponent) {
    this.formGroup.get(selectionControlName)?.valueChanges.subscribe(selected => {
      if (selected && component) {
        const formGroup = this.formGroup.get(formGroupName);
        if (formGroup instanceof FormGroup) {
          component.formGroup = formGroup;
          formGroup.enable();
        }
      } else {
        this.formGroup.get(formGroupName)?.disable();
      }
    });
  }

  get mailSenderFormGroup(): FormGroup {
    return this.formGroup.get('subTools.mailSender') as FormGroup;
  }

  get mailReaderFormGroup(): FormGroup {
    return this.formGroup.get('subTools.mailReader') as FormGroup;
  }

  get tool() {
    return ToolsHelper.get(this.data.tool.id);
  }

  transformFormValue(formValue: any): MailToolSettings {
    const { mailSenderSelected: send, mailReaderSelected: read, mailSender = {}, mailReader = {} } = formValue.subTools;
    const { auth = { user: '', pass: '' }, host = '', port = '', secure = false } = send ? mailSender : {};
    const { host: imapHost = '', port: imapPort = '', tls = false } = read ? mailReader : {};
  
    return {
      from: auth.user,
      replyTo: auth.user,
      auth,
      smtp: { host, port, tls: secure },
      imap: { host: imapHost, port: imapPort, tls },
      tools: { send, read }
    };
  }

  onSubmit() {
    const formValue = this.formGroup.value;
    const data = this.transformFormValue(formValue);
    this.dialogRef.close(data);
  }

}