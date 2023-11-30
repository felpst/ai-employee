import { Component } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { ToolsHelper } from '@cognum/helpers';
import { ITool } from "@cognum/interfaces";
import { AIEmployeesService } from "../../../ai-employees.service";

@Component({
  selector: 'cognum-ai-tool-add',
  templateUrl: './tool-add.component.html',
  styleUrls: ['./tool-add.component.scss'],
})
export class AIToolAddComponent {

  constructor(
    private aiEmployeeService: AIEmployeesService,
    private dialogRef: MatDialogRef<AIToolAddComponent>,
  ) { }

  get tools() {
    return ToolsHelper.tools.filter(tool => tool.show);
  }

  onSelect(tool: ITool) {
    this.aiEmployeeService.aiEmployee.tools.push({
      id: tool.id,
      options: {}
    })
    // Close modal add tools
    this.dialogRef.close();

    this.aiEmployeeService.update(this.aiEmployeeService.aiEmployee).subscribe(updatedEmployee => {
      // Open modal form tool (optional)
      console.log(tool)
    });
  }
}
