import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
<<<<<<< HEAD
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
=======
>>>>>>> 1947452df40a20cd9147c59280a3418e3a469cbe
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { AIEmployeeFormComponent } from './ai-employee-form/ai-employee-form.component';
import { DefaultPageComponent } from './default-page/default-page.component';
import { DialogComponent } from './dialog/dialog.component';
import { HeaderComponent } from './header/header.component';
import { SearchBarComponent } from './search-bar/search-bar.component';
import { StepperComponent } from './stepper/stepper.component';
import { TabNavigatorComponent } from './tab-navigator/tab-navigator.component';
import { UploadImageComponent } from './upload-image/upload-image.component';
import { UsersAvatarComponent } from './users-avatar/users-avatar.component';

const declarations: any[] = [
  DialogComponent,
  SearchBarComponent,
  UsersAvatarComponent,
  HeaderComponent,
  StepperComponent,
  AIEmployeeFormComponent,
  DefaultPageComponent,
  TabNavigatorComponent,
  UploadImageComponent
];

const Modules: any[] = [
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
  MatDialogModule,
  NgScrollbarModule,
  MatRippleModule,
  MatInputModule,
<<<<<<< HEAD
  MatProgressSpinnerModule
=======
>>>>>>> 1947452df40a20cd9147c59280a3418e3a469cbe
];

@NgModule({
  declarations,
  exports: [declarations, ...Modules],
  imports: [CommonModule, RouterModule, ...Modules],
})
export class SharedModule { }
