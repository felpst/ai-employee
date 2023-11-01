import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatComponent } from './chat/chat.component';
import { ChatsComponent } from './chats.component';

const routes: Routes = [
  {
    path: 'workspaces/:workspaceId',
    component: ChatsComponent,
    children: [{ path: 'chats/:chatId', component: ChatComponent }],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChatsRoutingModule {}
