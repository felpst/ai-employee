import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { MenuComponent } from './menu/menu.component';

const declarations: any[] = [MenuComponent, AdminComponent];

const MaterialModules: any[] = [
  MatButtonModule,
  MatIconModule,
  MatTooltipModule,
  MatMenuModule,
];

@NgModule({
  declarations,
  exports: declarations,
  imports: [CommonModule, RouterModule, MaterialModules],
})
export class LayoutsModule {}
