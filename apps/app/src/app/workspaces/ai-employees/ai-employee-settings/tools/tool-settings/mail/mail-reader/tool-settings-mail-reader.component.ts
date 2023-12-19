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
        const mailReaderOptions = this.data.tool?.options?.subTools?.mailReader;
        this.formGroup.addControl('user', new FormControl(mailReaderOptions?.user, Validators.required));
        this.formGroup.addControl('password', new FormControl(mailReaderOptions?.password, Validators.required));
        this.formGroup.addControl('host', new FormControl(mailReaderOptions?.host, Validators.required));
        this.formGroup.addControl('port', new FormControl(mailReaderOptions?.port, Validators.required));
        this.formGroup.addControl('tls', new FormControl(mailReaderOptions?.tls));
        this.formGroup.addControl('tlsOptions', this.formBuilder.group({
            servername: new FormControl(mailReaderOptions?.tlsOptions?.servername, Validators.required),
        }));
    }
}