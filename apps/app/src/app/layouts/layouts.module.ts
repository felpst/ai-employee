import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { LoadingComponent } from './loading/loading.component';
import { MenuComponent } from './menu/menu.component';
import { WorkspaceMembersComponent } from './menu/workspace-members/workspace-members.component';

const declarations: any[] = [
  AdminComponent,
  LoadingComponent,
  MenuComponent,
  WorkspaceMembersComponent,
];

const MaterialModules: any[] = [
  MatButtonModule,
  MatIconModule,
  MatTooltipModule,
  MatMenuModule,
  MatProgressBarModule,
  MatSidenavModule,
  MatToolbarModule,
  MatListModule,
];

@NgModule({
  declarations,
  exports: declarations,
  imports: [CommonModule, RouterModule, ...MaterialModules],
})
export class LayoutsModule {}
