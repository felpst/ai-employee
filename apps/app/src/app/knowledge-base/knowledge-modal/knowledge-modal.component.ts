import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { IKnowledge, IUser, IWorkspace } from '@cognum/interfaces';
import { UsersService } from '../../services/users/users.service';
import { DialogComponent } from '../../shared/dialog/dialog.component';
import { KnowledgeBaseService } from '../knowledge-base.service';
import { KnowledgeFormComponent } from '../knowledge-form/knowledge-form.component';

@Component({
    selector: 'cognum-knowledge-modal',
    templateUrl: './knowledge-modal.component.html',
    styleUrls: ['./knowledge-modal.component.scss'],
})
export class KnowledgeModalComponent {
  knowledge: IKnowledge | undefined;
  knowledgeBase: IKnowledge[] = [];
  workspace!: IWorkspace;
  searchText = '';
  knowledgeBaseFiltered: IKnowledge[] = [];
  isMoreHorizActive = false;
  isSharedActive = false;
  members: IUser[] = [];
  selectedPermission: string = 'Editor';
  
  constructor(
      private dialog: MatDialog,
      private dialogRef: MatDialogRef<KnowledgeModalComponent>,
      @Inject(MAT_DIALOG_DATA) 
      public data: IKnowledge,
      private knowledgeBaseService: KnowledgeBaseService,
      private usersService: UsersService
  ) {
      this.knowledge = data;
  }

  menuOpened() {
    this.isMoreHorizActive = true;
  }

  menuClosed() {
    this.isMoreHorizActive = false;
  }
  shareMenuOpened() {
    this.isSharedActive = true;
  }

  shareMenuClosed() {
    this.isSharedActive = false;
  }
  openShareMenu() {
    this.usersService.list().subscribe((members: IUser[]) => {
      this.members = members;
    });
  }

  clearSearch() {
    this.searchText = '';
    this.knowledgeBaseFiltered = this.knowledgeBase;
    console.log(this.knowledgeBaseFiltered)
  }

  loadKnowledgeBase(workspaceId: string) {
    return this.knowledgeBaseService
        .getAllFromWorkspace(workspaceId)
        .subscribe((knowledges) => {
        this.knowledgeBase = knowledges;
        this.clearSearch();
        });
  }

  closeModal(): void {
    this.dialogRef.close();
  }

  updatedTimeDifference(updatedAt: Date | undefined): string {
      if (!updatedAt) {
        return 'N/A';
      }

      const updatedAtDate = new Date(updatedAt); 
      const now = new Date();
      const diffMilliseconds = now.getTime() - updatedAtDate.getTime();
      const diffMinutes = Math.floor(diffMilliseconds / (1000 * 60));
      const diffHours = Math.floor(diffMinutes / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffMinutes < 60) {
        return `${diffMinutes} minutes ago`;
      } else if (diffHours < 24) {
        return `${diffHours} hours ago`;
      } else {
        return `${diffDays} days ago`;
      }
  }

  onForm(knowledge?: IKnowledge) {
      const dialogRef = this.dialog.open(KnowledgeFormComponent, {
        width: '640px',
        data: { knowledge, workspace: this.workspace },
      });
      dialogRef.afterClosed().subscribe((res) => {
        this.loadKnowledgeBase(this.workspace._id);
      });
  }

  editKnowledge(knowledge: IKnowledge) {
    this.onForm(knowledge);
  }

  deleteKnowledge(knowledge: IKnowledge) {
    this.knowledgeBaseService
      .delete(knowledge)
      .subscribe(() => this.loadKnowledgeBase(this.workspace._id));
  }

  openDeleteConfirmationDialog(knowledge: IKnowledge) {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        title: 'Delete Confirmation',
        content: 'Are you sure you want to delete this knowledge?',
        confirmText: 'Delete',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.deleteKnowledge(knowledge);
      }
    });
  }

  setPermission(member: IUser, permission: string) {
    this.selectedPermission = permission;
    // Not implemented. Depends on modeling to include permission levels
  }

  capitalizeName(name: string): string {
    return name.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  }

}    
