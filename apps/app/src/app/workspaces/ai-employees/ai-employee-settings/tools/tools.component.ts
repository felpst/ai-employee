import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';


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
        // const dialogRef = this.dialog.open(ComponentName, {
        //     width: '640px',
        // });
        // dialogRef.afterClosed().subscribe((res) => {
        //     if (res) {
        //     }
        // });
    }
}