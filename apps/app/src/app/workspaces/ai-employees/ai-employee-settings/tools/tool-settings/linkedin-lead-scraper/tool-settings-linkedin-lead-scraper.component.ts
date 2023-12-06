import { Component, Inject } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { ToolsHelper } from "@cognum/helpers";
import { IToolSettings } from "@cognum/interfaces";

@Component({
  selector: 'cognum-ai-tool-settings-linkedin-lead-scraper',
  templateUrl: './tool-settings-linkedin-lead-scraper.component.html',
  styleUrls: ['./tool-settings-linkedin-lead-scraper.component.scss'],
})
export class AIToolSettingsLinkedInLeadScraperComponent {
  formGroup: FormGroup;
  hide = true

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { tool: IToolSettings; },
    private dialogRef: MatDialogRef<AIToolSettingsLinkedInLeadScraperComponent>,
  ) {
    this.formGroup = new FormGroup({
      user: new FormControl(this.data.tool.options?.user, [Validators.required]),
      password: new FormControl(this.data.tool.options?.password, [Validators.required])
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
