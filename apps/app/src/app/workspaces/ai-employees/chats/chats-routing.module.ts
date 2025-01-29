import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatComponent } from './chat/chat.component';
import { ChatResolver } from './chat/chat.resolver';
import { ChatsComponent } from './chats.component';
import { ChatsResolver } from './chats.resolver';

const routes: Routes = [
  {
    path: '',
    resolve: [ChatsResolver],
    component: ChatsComponent,
    children: [
      {
        path: ':id',
        resolve: [ChatResolver],
        component: ChatComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChatsRoutingModule { }
