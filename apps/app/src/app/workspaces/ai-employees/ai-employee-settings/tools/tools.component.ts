import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { IAIEmployee } from '@cognum/interfaces';
import { AuthService } from 'apps/app/src/app/auth/auth.service';
import { DialogComponent } from 'apps/app/src/app/shared/dialog/dialog.component';
import { AIEmployeesService } from '../../ai-employees.service';
import { AIToolFormComponent } from './tool-form/tool-form.component';

@Component({
  selector: 'cognum-ai-employee-tools',
  templateUrl: './tools.component.html',
  styleUrls: ['./tools.component.scss'],
})
export class AIEmployeeToolsComponent {

  aiEmployee!: IAIEmployee;
  tools!: IAIEmployee['tools'];

  constructor(
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private authService: AuthService,
    private aiEmployeeService: AIEmployeesService
  ) { }

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.aiEmployee = data[0];
      this.tools = this.aiEmployee.tools;
    });
  }

  fetchTools() {
    return this.aiEmployeeService.get(this.aiEmployee._id).subscribe(updatedEmployee => {
      this.aiEmployee = updatedEmployee;
      this.tools = updatedEmployee.tools;
    });
  }

  addTool(tool?: { type: string; icon: string; options: any }, toolIndex?: number) {
    const dialogRef = this.dialog.open(AIToolFormComponent, {
      height: '75%',
      width: '75%',
      maxHeight: '650px',
      maxWidth: '700px',
      data: { tool, aiEmployee: this.aiEmployee },
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        if (toolIndex !== undefined) {
          this.aiEmployee.tools[toolIndex] = res;
        } else {
          this.aiEmployee.tools.push(res);
        }
        this.aiEmployeeService.update(this.aiEmployee).subscribe(updatedEmployee => {
          this.aiEmployee = updatedEmployee;
        });
      }
    });
  }

  deleteConfirmationDialog(tool: { type: string; icon: string; options: any; }, toolIndex: number) {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        title: 'Delete Confirmation',
        content: 'Are you sure you want to delete this tool?',
        confirmText: 'Delete',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.deleteTool(toolIndex);
      }
    });
  }

  deleteTool(toolIndex: number) {
    const tools = this.aiEmployee.tools.filter((t, index) => index !== toolIndex).map(tool => ({
      ...tool,
      type: tool.type || 'default_type',
      icon: tool.icon || 'default_icon',
      options: tool.options || {},
      createdBy: this.aiEmployee.createdBy,
      updatedBy: this.authService.user._id,
    }));

    this.aiEmployeeService.update({ ...this.aiEmployee, tools }).subscribe(updatedEmployee => {
      this.aiEmployee = updatedEmployee;
      this.fetchTools();
    });
  }
}
