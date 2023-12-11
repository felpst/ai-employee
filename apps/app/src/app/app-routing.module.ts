import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { ToolOAuth2Component } from './workspaces/ai-employees/ai-employee-settings/tools/tool-oauth2/tool-oauth2.component';

const routes: Routes = [
  // Public routes
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'oAuth2',
    children: [
      { path: 'google/callback', component: ToolOAuth2Component, },
    ]
  },

  // Admin routes
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      {
        path: 'account',
        loadChildren: () =>
          import('./account/account.module').then(
            (m) => m.AccountModule
          ),
      },
      {
        path: 'workspaces',
        loadChildren: () =>
          import('./workspaces/workspaces.module').then(
            (m) => m.WorkspacesModule
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
export class AppRoutingModule { }
