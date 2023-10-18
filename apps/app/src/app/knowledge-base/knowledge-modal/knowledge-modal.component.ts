import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { IKnowledge, IUser, IWorkspace } from '@cognum/interfaces';
import { AuthService } from '../../auth/auth.service';
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
  knowledge: IKnowledge;
  knowledgeBase: IKnowledge[] = [];
  workspace!: IWorkspace;
  searchText = '';
  knowledgeBaseFiltered: IKnowledge[] = [];
  isMoreHorizActive = false;
  isSharedActive = false;
  members: IUser[] = [];
  currentKnowledgePermissions: any[] = [];
  memberPermissions: { [userId: string]: string } = {};
  userId = '';
  
  constructor(
      private dialog: MatDialog,
      private dialogRef: MatDialogRef<KnowledgeModalComponent>,
      private authService: AuthService,
      @Inject(MAT_DIALOG_DATA) 
      public data: IKnowledge,
      private knowledgeBaseService: KnowledgeBaseService,
      private usersService: UsersService
  ) {
      this.knowledge = data;
      this.currentKnowledgePermissions = this.knowledge?.permissions || [];
      this.userId = this.authService.user?._id;
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

  isCreator(member: IUser): boolean {
    return !!this.knowledge && this.knowledge.createdBy === member._id;
  }

  openShareMenu() {
    this.usersService.list().subscribe((members: IUser[]) => {
      this.members = members;
      this.members.forEach((member) => {
        const knowledgePermission = this.currentKnowledgePermissions.find(p => p.userId === member._id);
        if (knowledgePermission) {
          this.memberPermissions[member._id] = knowledgePermission.permission;
        } else if (this.knowledge?.createdBy === member._id) {
          this.memberPermissions[member._id] = 'Editor';
        } else {
          this.memberPermissions[member._id] = 'Reader';
        }
      });
    
    });
  }

  userHasEditorPermission(knowledge: IKnowledge): boolean {
    return this.knowledgeBaseService.userPermission(
      knowledge,
      this.userId
    );
  }

  clearSearch() {
    this.searchText = '';
    this.knowledgeBaseFiltered = this.knowledgeBase;
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
    if (this.permissionsChanged()) {
      this.updatePermissionsInDatabase();
    }

    this.dialogRef.close();
  }

  permissionsChanged(): boolean {
    if (this.members.length !== this.currentKnowledgePermissions.length) {
      return true;
    }
  
    for (const member of this.members) {
      const currentPermission = this.memberPermissions[member._id];
      const originalPermission = this.currentKnowledgePermissions.find(p => p.userId === member._id)?.permission;
  
      if (currentPermission !== originalPermission) {
        return true;
      }
    }
  
    return false;
  }

  updatePermissionsInDatabase() {
    const updatedPermissions: { userId: string; permission: 'Reader' | 'Editor' }[] = [];
  
    this.members.forEach((member) => {
      const existingPermission = this.knowledge?.permissions.find((p) => p.userId === member._id);
  
      if (existingPermission) {
        updatedPermissions.push(existingPermission);
      } else {
        updatedPermissions.push({
          userId: member._id,
          permission: 'Reader',
        });
      }
    });
  
    if (this.knowledge) {
      this.knowledge.permissions = updatedPermissions;
  
      this.knowledgeBaseService.update(this.knowledge).subscribe(
        (updatedKnowledge) => {
          console.log('Successfully updated knowledge', updatedKnowledge);
        },
        (error) => {
          console.error('Error updating knowledge:', error);
        }
      );
    }
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
    this.memberPermissions[member._id] = permission;
    const existingPermissionIndex = this.currentKnowledgePermissions.findIndex(p => p.userId === member._id);
  
    if (existingPermissionIndex !== -1) {
      this.currentKnowledgePermissions[existingPermissionIndex].permission = permission;
    } else {
      this.currentKnowledgePermissions.push({ userId: member._id, permission });
    }
    this.currentKnowledgePermissions = [...this.currentKnowledgePermissions];
  }
  
  
  getPermission(memberId: string): string {
    const permission = this.currentKnowledgePermissions.find(p => p.userId === memberId);
    return permission ? permission.permission : 'Reader';
  }


  capitalizeName(name: string): string {
    return name.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  }

}    
