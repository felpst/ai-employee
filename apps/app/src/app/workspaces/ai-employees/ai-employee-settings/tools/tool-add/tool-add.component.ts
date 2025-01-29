import { Component, EventEmitter, Output } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { ToolsHelper } from '@cognum/helpers';
import { ITool } from "@cognum/interfaces";
import { AIEmployeesService } from "../../../ai-employees.service";
import { ToolsService } from "../tools.service";

@Component({
  selector: 'cognum-ai-tool-add',
  templateUrl: './tool-add.component.html',
  styleUrls: ['./tool-add.component.scss'],
})
export class AIToolAddComponent {

  @Output() toolSelected = new EventEmitter<ITool>();

  constructor(
    private aiEmployeeService: AIEmployeesService,
    private toolsService: ToolsService,
    private dialogRef: MatDialogRef<AIToolAddComponent>,
  ) { }

  get tools() {
    return ToolsHelper.tools.filter(tool => tool.show);
  }

  onSelect(tool: ITool) {
    const newIndex = this.aiEmployeeService.aiEmployee.tools.length;
    this.aiEmployeeService.aiEmployee.tools.push({
      id: tool.id,
      options: {}
    });
    this.dialogRef.close();

    this.aiEmployeeService.update(this.aiEmployeeService.aiEmployee).subscribe(updatedEmployee => {
      this.toolsService.toolSelected.emit({ tool, index: newIndex });
    });
  }
}
