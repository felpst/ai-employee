import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { IKnowledge, IUser, IWorkspace } from '@cognum/interfaces';
import { AuthService } from '../../auth/auth.service';
import { NotificationsService } from '../../services/notifications/notifications.service';
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
      private notificationsService: NotificationsService,
      private usersService: UsersService,
  ) {
      this.knowledge = data;
      this.currentKnowledgePermissions = this.knowledge?.permissions || [];
      this.userId = this.authService.user?._id;
      this.members = []; 

      this.memberPermissions = this.currentKnowledgePermissions.reduce((permissions, permission) => {
          permissions[permission.userId] = permission.permission;
          return permissions;
      }, {});
      this.loadMembersFromPermissions(); 

  }

  async menuOpened() {
    this.isMoreHorizActive = true;
  }

  menuClosed() {
    this.isMoreHorizActive = false;
  }
  
  async shareMenuOpened() {
    this.isSharedActive = true;
  }

  shareMenuClosed() {
    this.isSharedActive = false;
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

  async loadMembersFromPermissions() {
      const memberIds = this.currentKnowledgePermissions.map(p => p.userId);
      try {
          const members = await this.usersService.list().toPromise();
          if (members) {
              this.members = [];
              for (const member of members) {
                  if (member._id !== this.knowledge.createdBy) {
                      if (memberIds.includes(member._id)) {
                          this.members.push(member);
                      } else {
                          this.members.push(member);
                          this.memberPermissions[member._id] = 'Reader'; 
                      }
                  }
              }
          }
      } catch (error) {
          console.error('Error getting members', error);
      }
  }

  closeModal(): void {
    this.dialogRef.close();
  }

  isCreator(member: IUser): boolean {
    return !!this.knowledge && this.knowledge.createdBy === member._id;
  }

  userHasEditorPermission(knowledge: IKnowledge): boolean {
    return this.knowledgeBaseService.userPermission(
      knowledge,
      this.userId
    );
  }

  permissionsChanged(): boolean {
    let changed = false; 
  
    if (this.members.length !== this.currentKnowledgePermissions.length) {
      changed = true; 
    }
    for (const member of this.members) {
      
      const currentPermission = this.memberPermissions[member._id];

      const originalPermission = this.currentKnowledgePermissions.find(p => p.userId === member._id)?.permission;
      if (currentPermission !== originalPermission) {
        changed = true; 
      }
    }
    return changed; 
  }

  setPermission(member: IUser, permission: string) {
    const currentPermission = this.currentKnowledgePermissions.find(p => p.userId === member._id)?.permission;
    if (!currentPermission || currentPermission !== permission) {
  
      if (member._id !== this.knowledge.createdBy) {
        this.memberPermissions[member._id] = permission;
  
        this.updatePermissionsInDatabase(member, permission);
      }
    }
  }

  applyPermissionsChanges() {
    this.members.forEach((member) => {
      const existingPermissionIndex = this.currentKnowledgePermissions.findIndex(p => p.userId === member._id);
      if (existingPermissionIndex !== -1) {
        this.currentKnowledgePermissions[existingPermissionIndex].permission = this.memberPermissions[member._id];
      }
    });
    
  }

  updatePermissionsInDatabase(member: IUser, permission: string) {
    if (member._id === this.knowledge.createdBy) {
      return; 
    }
  
    const existingPermission = this.knowledge?.permissions.find((p) => p.userId === member._id);
  
    if (existingPermission) {
      existingPermission.permission = permission as "Reader" | "Editor";
    } else {
      const newPermission = { userId: member._id, permission: permission as "Reader" | "Editor" };
      this.knowledge.permissions.push(newPermission);
    }
  
    this.knowledgeBaseService.update(this.knowledge).subscribe({
      next: (res) => {
        this.notificationsService.show('Successfully updated knowledge');
      },
      error: (error) => {
        if (error.status === 403 && error.error && error.error.message === 'Cannot change creator permission') {
        } else {
          console.error('Error updating knowledge:', error);
          this.notificationsService.show('Error updating knowledge. Please try again.');
        }
      },
    });
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

  capitalizeName(name: string): string {
    return name.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  }

}    
