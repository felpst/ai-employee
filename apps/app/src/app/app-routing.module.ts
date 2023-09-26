import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { AdminComponent } from './layouts/admin/admin.component';

const routes: Routes = [
  // Public routes
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
  },

  // Admin routes
  {
    path: '',
    component: AdminComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'workspaces',
        loadChildren: () =>
          import('./workspaces/workspaces.module').then(
            (m) => m.WorkspacesModule
          ),
      },
      {
        path: 'chats',
        loadChildren: () =>
          import('./chats/chats.module').then((m) => m.ChatsModule),
      },
      {
        path: 'knowledge-base',
        loadChildren: () =>
          import('./knowledge-base/knowledge-base.module').then(
            (m) => m.KnowledgeBaseModule
          ),
      },
      { path: '**', redirectTo: 'workspaces', pathMatch: 'full' },
    ],
  },
  { path: '**', redirectTo: 'auth', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
