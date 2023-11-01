import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { DialogComponent } from './dialog/dialog.component';
import { SearchBarComponent } from './search-bar/search-bar.component';
import { UsersAvatarComponent } from './users-avatar/users-avatar.component';

const declarations: any[] = [
  DialogComponent,
  SearchBarComponent,
  UsersAvatarComponent
];

const MaterialModules: any[] = [
  FormsModule,
  ReactiveFormsModule,
  MatButtonModule,
  MatIconModule,
  MatTooltipModule,
  MatMenuModule,
  MatProgressBarModule,
  MatSidenavModule,
  MatToolbarModule,
  MatListModule,
  MatDialogModule
];

@NgModule({
  declarations,
  exports: declarations,
  imports: [CommonModule, RouterModule, MaterialModules],
})
export class SharedModule {}
