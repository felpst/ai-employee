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
      name: new FormControl(this.data.tool.options?.name, [Validators.required]),
      host: new FormControl(this.data.tool.options?.host, [Validators.required]),
      port: new FormControl(this.data.tool.options?.port, [Validators.required]),
      auth: new FormGroup({
        user: new FormControl(this.data.tool.options?.auth?.user, [Validators.required]),
        pass: new FormControl(this.data.tool.options?.auth?.pass, [Validators.required]),
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
