import { Component, Inject } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { ToolsHelper } from "@cognum/helpers";
import { IToolSettings } from "@cognum/interfaces";
import { CoreApiService } from "apps/app/src/app/services/apis/core-api.service";

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
    private api: CoreApiService
  ) {
    this.formGroup = new FormGroup({
      auth: new FormGroup({
        user: new FormControl(this.data.tool.options?.auth.user, [Validators.required]),
        password: new FormControl(this.data.tool.options?.auth.password, [Validators.required]),
      }),
      tools: new FormGroup({
        findLeads: new FormControl(this.data.tool.options?.tools?.findLeads, [Validators.required]),
      })
    });
  }

  get tool() {
    return ToolsHelper.get(this.data.tool.id);
  }

  onSubmit() {
    const data = this.formGroup.value;
    console.log(data);

    this.dialogRef.close(data);
  }

  onTest() {
    this.api.post('tests/linkedinFindLeads', {
      auth: this.formGroup.value.auth,
      "query": "Engenheiros de Software",
      "quantity": 3,
    }).subscribe((leads) => {
      console.log(leads);
    });
  }

}
