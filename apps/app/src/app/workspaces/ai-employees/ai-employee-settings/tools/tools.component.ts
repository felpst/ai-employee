import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { IAIEmployee } from '@cognum/interfaces';
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
  ) { }

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.aiEmployee = data[0];
      this.tools = this.aiEmployee.tools;
    });
  }

  addTool() {
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
