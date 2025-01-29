import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { LMarkdownEditorModule } from 'ngx-markdown-editor';
import { SharedModule } from '../../shared/shared.module';
import { AdminAIEmployeeComponent } from './admin-ai-employee/admin-ai-employee.component';
import { MenuAIEmployeeItemsComponent } from './admin-ai-employee/menu-ai-employee/menu-ai-employee-items/menu-ai-employee-items.component';
import { MenuAIEmployeeProfileComponent } from './admin-ai-employee/menu-ai-employee/menu-ai-employee-profile/menu-ai-employee-profile.component';
import { MenuAIEmployeeComponent } from './admin-ai-employee/menu-ai-employee/menu-ai-employee.component';
import { AIEmployeeFileManagerFormComponent } from './ai-employee-file-manager/ai-employee-file-manager-form/ai-employee-file-manager-form.component';
import { AIEmployeeFileManagerComponent } from './ai-employee-file-manager/ai-employee-file-manager.component';
import { AIEmployeeHistoryComponent } from './ai-employee-history/ai-employee-history.component';
import { AIEmployeeMemoryFormComponent } from './ai-employee-memory/ai-employee-memory-form/ai-employee-memory-form.component';
import { AIEmployeeMemoryComponent } from './ai-employee-memory/ai-employee-memory.component';
import { AIEmployeeSettingsModule } from './ai-employee-settings/ai-employee-settings.module';
import { AIEmployeesRoutingModule } from './ai-employees-routing.module';
import { AIEmployeesComponent } from './ai-employees.component';
import { WhiteAiEmployeeComponent } from './white-ai-employee/white-ai-employee.component';

@NgModule({
  declarations: [
    AIEmployeesComponent,
    WhiteAiEmployeeComponent,
    AdminAIEmployeeComponent,
    MenuAIEmployeeComponent,
    MenuAIEmployeeItemsComponent,
    MenuAIEmployeeProfileComponent,
    AIEmployeeMemoryComponent,
    AIEmployeeMemoryFormComponent,
    AIEmployeeHistoryComponent,
    AIEmployeeFileManagerComponent,
    AIEmployeeFileManagerFormComponent,
  ],
  imports: [
    CommonModule,
    AIEmployeesRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    HttpClientModule,
    SharedModule,
    AIEmployeeSettingsModule,
    MatCardModule,
    LMarkdownEditorModule,
    MatTableModule,
    MatPaginatorModule,
  ],
})
export class AIEmployeesModule {}
