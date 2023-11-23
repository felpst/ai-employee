import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AIToolFormComponent } from './tool-form/tool-form.component';


@Component({
  selector: 'cognum-ai-employee-tools',
  templateUrl: './tools.component.html',
  styleUrls: ['./tools.component.scss'],
})
export class AIEmployeeToolsComponent {
  constructor(
    private dialog: MatDialog,
  ) { }

  addTool() {
    // Add form component when ready
    const dialogRef = this.dialog.open(AIToolFormComponent, {
      height: '75%',
      width: '75%',
      maxHeight: '650px',
      maxWidth: '700px'
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        console.log({ res });

      }
    });
  }
}
