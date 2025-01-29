import { Component, Inject } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { ToolsHelper } from "@cognum/helpers";
import { IToolSettings } from "@cognum/interfaces";

@Component({
  selector: 'cognum-ai-tool-settings-google-calendar',
  templateUrl: './tool-settings-google-calendar.component.html',
  styleUrls: ['./tool-settings-google-calendar.component.scss'],
})
export class AIToolSettingsGoogleCalendarComponent {
  formGroup: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { tool: IToolSettings; },
    private dialogRef: MatDialogRef<AIToolSettingsGoogleCalendarComponent>,
  ) {
    this.formGroup = new FormGroup({
      list: new FormControl(this.data.tool.options?.tools?.list, [Validators.required]),
      create: new FormControl(this.data.tool.options?.tools?.create, [Validators.required]),
      update: new FormControl(this.data.tool.options?.tools?.update, [Validators.required]),
      delete: new FormControl(this.data.tool.options?.tools?.delete, [Validators.required]),
    });
  }

  get tool() {
    return ToolsHelper.get(this.data.tool.id);
  }

  onSubmit() {
    const options = {
      ...this.data.tool.options,
      tools: this.formGroup.value
    };
    this.dialogRef.close(options);
  }

}
