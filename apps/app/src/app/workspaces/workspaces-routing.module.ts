import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AiEmployeeComponent } from './ai-employee/ai-employee.component';
import { AiEmployeeComponentSettings } from './ai-employee/aiEmployee-settings/ai-employee-settings.component';
import { ChatComponent } from './chats/chat/chat.component';
import { ChatsComponent } from './chats/chats.component';
import { KnowledgeBaseComponent } from './knowledge-base/knowledge-base.component';
import { WorkspaceResolver } from './workspace.resolver';
import { WorkspaceComponent } from './workspace/workspace.component';

const routes: Routes = [
  {
    path: ':id',
    resolve: [WorkspaceResolver],
    children: [
      {
        path: 'overview',
        component: WorkspaceComponent,
      },
      {
        path: 'ai-employees',
        loadChildren: () =>
          import('./ai-employees/ai-employees.module').then(
            (m) => m.AIEmployeesModule
          ),
      },

      {
        path: 'history',
        component: WorkspaceComponent,
      },
      {
        path: 'knowledge-base',
        component: KnowledgeBaseComponent,
      },
      {
        path: 'chats',
        component: ChatsComponent,
        children: [
          { path: ':chatId', component: ChatComponent } 
        ]
      },
      { path: '**', redirectTo: 'overview', pathMatch: 'full' },
    ],
  },
  { path: '**', redirectTo: '/', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WorkspacesRoutingModule {}
