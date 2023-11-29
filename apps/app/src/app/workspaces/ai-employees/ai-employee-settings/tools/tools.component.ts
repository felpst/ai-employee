import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToolsHelper } from '@cognum/helpers';
import { DialogComponent } from 'apps/app/src/app/shared/dialog/dialog.component';
import { AIEmployeesService } from '../../ai-employees.service';
import { AIToolAddComponent } from './tool-add/tool-add.component';
import { AIToolSettingsDatabaseComponent } from './tool-settings/database/tool-settings-database.component';
import { AIToolSettingsMailSenderComponent } from './tool-settings/mail-sender/tool-settings-mail-sender.component';

@Component({
  selector: 'cognum-ai-employee-tools',
  templateUrl: './tools.component.html',
  styleUrls: ['./tools.component.scss'],
})
export class AIEmployeeToolsComponent {
  constructor(
    private dialog: MatDialog,
    private aiEmployeeService: AIEmployeesService
  ) { }

  get tools() {
    return this.aiEmployeeService.aiEmployee.tools.map(tool => ({
      id: tool.id,
      name: ToolsHelper.get(tool.id)?.name,
      icon: ToolsHelper.get(tool.id)?.icon,
      description: ToolsHelper.get(tool.id)?.description,
    }));
  }

  addTool() {
    this.dialog.open(AIToolAddComponent, { width: '400px' });
  }

  onSelect(index: number) {
    const tool = this.aiEmployeeService.aiEmployee.tools[index];
    let component: any;

    switch (tool.id) {
      case 'database':
        component = AIToolSettingsDatabaseComponent;
        break;
      case 'mail-sender':
        component = AIToolSettingsMailSenderComponent;
        break;
    }
    if (component) {
      const dialogRef = this.dialog.open(component, { width: '400px', data: { tool } });
      dialogRef.afterClosed().subscribe((data) => {
        if (data) {
          this.aiEmployeeService.aiEmployee.tools[index].options = data;
          this.aiEmployeeService.update({
            _id: this.aiEmployeeService.aiEmployee._id,
            tools: this.aiEmployeeService.aiEmployee.tools
          }).subscribe(updatedEmployee => {
            this.aiEmployeeService.aiEmployee = updatedEmployee;
          });
        }
      });
    }
  }

  onDelete(index: number) {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        title: 'Delete Confirmation',
        content: 'Are you sure you want to delete this tool?',
        confirmText: 'Delete',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.aiEmployeeService.aiEmployee.tools.splice(index, 1);
        this.aiEmployeeService.update({
          _id: this.aiEmployeeService.aiEmployee._id,
          tools: this.aiEmployeeService.aiEmployee.tools
        }).subscribe(updatedEmployee => {
          this.aiEmployeeService.aiEmployee = updatedEmployee;
        });
      }
    });
  }
}
