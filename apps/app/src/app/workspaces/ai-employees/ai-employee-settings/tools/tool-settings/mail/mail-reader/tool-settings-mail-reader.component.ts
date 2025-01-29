import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { IToolSettings } from "@cognum/interfaces";

@Component({
    selector: 'cognum-ai-tool-settings-mail-reader',
    templateUrl: './tool-settings-mail-reader.component.html',
    styleUrls: ['./tool-settings-mail-reader.component.scss'],
})
export class AIToolSettingsMailReaderComponent implements OnInit {
    @Input() formGroup!: FormGroup;
    @Input() data!: { tool: IToolSettings; };

    constructor(
        private formBuilder: FormBuilder,
    ) { }

    ngOnInit() {
        const mailReaderOptions = this.data.tool?.options;
        this.formGroup.addControl('user', new FormControl(mailReaderOptions?.auth?.user, Validators.required));
        this.formGroup.addControl('password', new FormControl(mailReaderOptions?.auth?.pass, Validators.required));
        this.formGroup.addControl('host', new FormControl(mailReaderOptions?.imap?.host, Validators.required));
        this.formGroup.addControl('port', new FormControl(mailReaderOptions?.imap?.port, Validators.required));
        this.formGroup.addControl('tls', new FormControl(mailReaderOptions?.imap?.tls));
        this.formGroup.addControl('tlsOptions', this.formBuilder.group({
            servername: new FormControl(mailReaderOptions?.imap?.servername, Validators.required),
        }));
    }
}