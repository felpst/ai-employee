import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { IToolSettings } from '@cognum/interfaces';

@Component({
    selector: 'cognum-ai-tool-settings-mail-sender',
    templateUrl: './tool-settings-mail-sender.component.html',
    styleUrls: ['./tool-settings-mail-sender.component.scss'],
})
export class AIToolSettingsMailSenderComponent implements OnInit {
    @Input() formGroup!: FormGroup;
    @Input() data!: { tool: IToolSettings; };

    constructor(private formBuilder: FormBuilder) { }

    ngOnInit() {
        const mailSenderOptions = this.data.tool?.options;
        this.formGroup.addControl('host', new FormControl(mailSenderOptions?.smtp?.host, Validators.required));
        this.formGroup.addControl('port', new FormControl(mailSenderOptions?.smtp?.port, Validators.required));
        this.formGroup.addControl('secure', new FormControl(mailSenderOptions?.smtp?.tls, Validators.required));
        this.formGroup.addControl('auth', this.formBuilder.group({
            user: new FormControl(mailSenderOptions?.auth?.user, Validators.required),
            pass: new FormControl(mailSenderOptions?.auth?.pass, Validators.required),
        }));
    }
}