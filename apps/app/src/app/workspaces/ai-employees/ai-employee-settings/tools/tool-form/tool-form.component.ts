/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthService } from '../../../../../auth/auth.service';
import { NotificationsService } from '../../../../../services/notifications/notifications.service';
import { inListValidator } from '../../../../../shared/validations';
import { AIEmployeesService } from '../../../ai-employees.service';
import { AIEmployeeToolsComponent } from '../tools.component';


@Component({
  selector: 'cognum-ai-tool-form',
  templateUrl: './tool-form.component.html',
  styleUrls: ['./tool-form.component.scss'],
})
export class AIToolFormComponent implements OnInit {
  toolForm!: FormGroup;
  types = [
    { 'name': 'Calculator', 'value': 'calculator' },
    { 'name': 'Database connect', 'value': 'database-connect' },
    { 'name': 'Mail sender', 'value': 'mail-sender' },
    { 'name': 'Web search', 'value': 'serp-api' },
  ];
  // Dialects supported: https://typeorm.io/data-source-options
  dialects = [
    { 'name': 'MySQL', 'value': 'mysql' },
    { 'name': 'PostgreSQL', 'value': 'postgres' },
    { 'name': 'Cockroachdb', 'value': 'cockroachdb' },
    { 'name': 'Spanner', 'value': 'spanner' },
    { 'name': 'MariaDB', 'value': 'mariadb' },
  ];
  // Nodemailer supported services: https://community.nodemailer.com/2-0-0-beta/setup-smtp/well-known-services/
  services = ["1und1", "AOL", "DebugMail.io", "DynectEmail", "FastMail", "GandiMail", "Gmail", "Godaddy", "GodaddyAsia", "GodaddyEurope", "hot.ee", "Hotmail", "iCloud", "mail.ee", "Mail.ru", "Mailgun", "Mailjet", "Mandrill", "Naver", "Postmark", "QQ", "QQex", "SendCloud", "SendGrid", "SES", "Sparkpost", "Yahoo", "Yandex", "Zoho"]
  mapIcon = {
    'calculator': 'https://storage.googleapis.com/factory-assets/tools/calculator-tool.png',
    'database-connect': 'https://storage.googleapis.com/factory-assets/tools/database-tool.png',
    'mail-sender': 'https://storage.googleapis.com/factory-assets/tools/email-tool.png',
    'serp-api': 'https://storage.googleapis.com/factory-assets/tools/web-search-tool.png',
  }
  submitting = false
  constructor(
    private dialogRef: MatDialogRef<AIEmployeeToolsComponent>,
    private formBuilder: FormBuilder,
    private employeesService: AIEmployeesService,
    private notificationsService: NotificationsService,
    private authService: AuthService,
  ) {
    this.toolForm = this.formBuilder.group({
      type: ['', [Validators.required, inListValidator(this.types.map(({ value }) => value))]],
      service: [''],
      username: [''],
      password: [''],
      dialect: [''],
      host: [''],
      database: [''],
      tables: [''],
    });

    this.toolForm.get('type')?.valueChanges.subscribe(type => {
      const commonFields = ['username', 'password'];
      const mailFields = ['service'];
      const databaseFields = ['dialect', 'host', 'database', 'tables'];
      const typeCommon = type === 'mail-sender' || type === 'database-connect';
      const typeMail = type === 'mail-sender';
      const typeDb = type === 'database-connect';
      commonFields.forEach(field => {
        const control = this.toolForm.get(field);
        if (typeCommon) {
          control?.addValidators(Validators.required);
          if (typeMail && field === 'username') {
            control?.addValidators(Validators.email);
          }
        }
        else control?.clearValidators();
        control?.updateValueAndValidity();
      })
      mailFields.forEach(field => {
        const control = this.toolForm.get(field);
        if (typeMail) control?.addValidators([Validators.required, inListValidator(this.services)]);
        else control?.clearValidators();
        control?.updateValueAndValidity();
      })
      databaseFields.forEach(field => {
        const control = this.toolForm.get(field);
        if (typeDb) {
          control?.addValidators(Validators.required);
          if (field === 'dialect') {
            control?.addValidators(inListValidator(this.dialects.map(({ value }) => value)));
          }
        }
        else control?.clearValidators();
        control?.updateValueAndValidity();
      })
    })
  }



  ngOnInit(): void {
    const toolNames = this.employee.tools.map(({ name }) => name);
    let _types = this.types;
    if (toolNames.includes('calculator')) {
      _types = _types.filter(({ value }) => value !== 'calculator')
    }
    if (toolNames.includes('serp-api')) {
      _types = _types.filter(({ value }) => value !== 'serp-api')
    }
    this.types = _types;
  }

  onSubmit() {
    if (!this.toolForm.valid) return;
    this.submitting = true;
    const userId = this.user._id;
    const { type } = this.toolForm.value;
    // @ts-ignore
    const icon = this.mapIcon[type] || '';
    const options = this.fillOptions();
    const tool = { type, icon, options, createdBy: userId, updatedBy: userId }
    return this.updateData(tool);

  }

  closeModal(): void {
    this.dialogRef.close();
  }

  hasInputError(inputName: string, errorName: string) {
    return (
      this.toolForm.get(inputName)?.invalid &&
      this.toolForm.get(inputName)?.touched &&
      this.toolForm.get(inputName)?.hasError(errorName)
    );
  }

  get user() {
    return this.authService.user;
  }

  get type() {
    return this.toolForm.get('type')?.value;
  }

  get employee() {
    return this.employeesService.aiEmployee;
  }

  private fillOptions() {
    const { type, ...rest } = this.toolForm.value;
    let options = {};
    if (type === 'mail-sender') {
      const { service, username, password } = rest;
      options = { service, user: username, password }
    } else if (type === 'database-connect') {
      const { username, password, dialect, host, database, tables } = rest;
      const _tables = tables.split(',').filter((value: string) => !!value).map((cleaned: string) => cleaned.trim());
      options = { type: dialect, host, username, password, database, tables: _tables }
    }
    return options
  }

  private updateData(tool: any) {
    const employee = this.employee;
    const tools = [...employee.tools, tool];
    return this.employeesService.update({ ...employee, tools }).subscribe({
      next: (employee) => {
        this.employeesService.aiEmployee = employee;
        this.notificationsService.show('Employee updated successfully!');
        this.submitting = false;
        this.closeModal()
      },
      error: () => {
        this.notificationsService.show(
          "Oops, it looks like there was an error... Please try again in a few minutes"
        );
        this.submitting = false;
      },
    });
  }

}
