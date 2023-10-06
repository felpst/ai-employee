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
    canActivate: [AuthGuard],
    children: [
      {
        path: 'home',
        loadChildren: () =>
          import('./home/home.module').then((m) => m.HomeComponentModule),
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
        path: 'chats',
        component: AdminComponent,
        loadChildren: () =>
          import('./chats/chats.module').then((m) => m.ChatsModule),
      },
      {
        path: 'knowledge-base',
        component: AdminComponent,
        loadChildren: () =>
          import('./knowledge-base/knowledge-base.module').then(
            (m) => m.KnowledgeBaseModule
          ),
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
