import { Component, Inject } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { ToolsHelper } from "@cognum/helpers";
import { IToolSettings } from "@cognum/interfaces";

@Component({
  selector: 'cognum-ai-tool-settings-mail-sender',
  templateUrl: './tool-settings-mail-sender.component.html',
  styleUrls: ['./tool-settings-mail-sender.component.scss'],
})
export class AIToolSettingsMailSenderComponent {
  formGroup: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { tool: IToolSettings; },
    private dialogRef: MatDialogRef<AIToolSettingsMailSenderComponent>,
  ) {
    this.formGroup = new FormGroup({
      host: new FormControl(this.data.tool.options?.host, [Validators.required]),
      port: new FormControl(this.data.tool.options?.port, [Validators.required]),
      secure: new FormControl(this.data.tool.options?.host, [Validators.required]),
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
