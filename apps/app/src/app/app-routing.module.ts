import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { AdminComponent } from './layouts/admin/admin.component';
import { CreateWorkspaceComponent } from './workspaces/create-workspace/create-workspace.component';

const routes: Routes = [
  // Public routes
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
  },

  // Admin routes
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./home/home.module').then((m) => m.HomeComponentModule),
      },
      {
        path: 'settings',
        loadChildren: () =>
          import('./settings/settings.module').then(
            (m) => m.SettingsComponentModule
          ),
      },
      {
        path: 'create-workspace',
        component: CreateWorkspaceComponent,
        loadChildren: () =>
          import('./workspaces/create-workspace/create-workspace.module').then(
            (m) => m.CreateWorkspaceModule
          ),
      },
      {
        path: 'workspaces',
        component: AdminComponent,
        loadChildren: () =>
          import('./workspaces/workspaces.module').then(
            (m) => m.WorkspacesModule
          ),
      },
      {
        path: 'ai-employee',
        component: AdminComponent,
        loadChildren: () =>
          import('./ai-employee/ai-employee.module').then(
            (m) => m.AiEmployeeModule
          ),
      },
      {
        path: 'chats',
        component: AdminComponent,
        loadChildren: () =>
          import('./chats/chats.module').then((m) => m.ChatsModule),
      },
      { path: '**', redirectTo: 'home', pathMatch: 'full' },
    ],
  },
  { path: '**', redirectTo: 'auth', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
