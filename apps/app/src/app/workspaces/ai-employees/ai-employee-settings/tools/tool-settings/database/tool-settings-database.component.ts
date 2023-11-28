import { Component, Inject } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { ToolsHelper } from "@cognum/helpers";
import { IToolSettings } from "@cognum/interfaces";

@Component({
    selector: 'cognum-ai-tool-settings-database',
    templateUrl: './tool-settings-database.component.html',
    styleUrls: ['./tool-settings-database.component.scss'],
})
export class AIToolSettingsDatabaseComponent {
    formGroup: FormGroup

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: { tool: IToolSettings; },
        private dialogRef: MatDialogRef<AIToolSettingsDatabaseComponent>,
    ) {
        this.formGroup = new FormGroup({
            database: new FormControl(this.data.tool.options?.database, [Validators.required]),
            db_name: new FormControl(this.data.tool.options?.db_name, [Validators.required]),
            host: new FormControl(this.data.tool.options?.host, [Validators.required]),
            db_port: new FormControl(this.data.tool.options?.db_port, [Validators.required]),
            auth: new FormGroup({
                username: new FormControl(this.data.tool.options?.auth?.username, [Validators.required]),
                password: new FormControl(this.data.tool.options?.auth?.password, [Validators.required]),
            })
        });
    }

    get tool() {
        return ToolsHelper.get(this.data.tool.id);
    }

    onSubmit() {
        const data = this.formGroup.value;
        this.dialogRef.close(data);
    }
}