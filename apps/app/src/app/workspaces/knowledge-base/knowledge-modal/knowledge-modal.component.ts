import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef
} from '@angular/material/dialog';
import { IKnowledge, IUser, IWorkspace } from '@cognum/interfaces';
import { AuthService } from '../../../auth/auth.service';
import { NotificationsService } from '../../../services/notifications/notifications.service';
import { UsersService } from '../../../services/users/users.service';
import { KnowledgeBaseService } from '../knowledge-base.service';

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
    private dialogRef: MatDialogRef<KnowledgeModalComponent>,
    private authService: AuthService,
    @Inject(MAT_DIALOG_DATA)
    public data: IKnowledge,
    private knowledgeBaseService: KnowledgeBaseService,
    private notificationsService: NotificationsService,
    private usersService: UsersService
  ) {
    this.knowledge = data;
    this.currentKnowledgePermissions = this.knowledge?.permissions || [];
    this.userId = this.authService.user?._id;
    this.members = [];

    this.memberPermissions = this.currentKnowledgePermissions.reduce(
      (permissions, permission) => {
        permissions[permission.userId] = permission.permission;
        return permissions;
      },
      {}
    );
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

  loadMembersFromPermissions() {
    const memberIds = this.currentKnowledgePermissions.map((p) => p.userId);
    this.usersService.list().subscribe(members => {
      this.members = members?.filter(member => member._id !== this.knowledge.createdBy) || [];
      this.members.forEach(member => {
        if (!memberIds.includes(member._id)) {
          this.memberPermissions[member._id] = 'Reader';
        }
      });
    }, error => {
      console.error('Error getting members', error);
    });
  }

  closeModal(): void {
    this.dialogRef.close();
  }

  isCreator(member: IUser): boolean {
    return !!this.knowledge && this.knowledge.createdBy === member._id;
  }

  userHasEditorPermission(knowledge: IKnowledge): boolean {
    return this.knowledgeBaseService.userPermission(knowledge, this.userId);
  }

  permissionsChanged(): boolean {
    if (this.members.length !== this.currentKnowledgePermissions.length) {
      return true;
    }

    return this.members.some(member => {
      const currentPermission = this.memberPermissions[member._id];
      const originalPermission = this.currentKnowledgePermissions.find(
        (p) => p.userId === member._id
      )?.permission;

      return currentPermission !== originalPermission;
    });
  }

  setPermission(member: IUser, permission: 'Reader' | 'Editor') {
    const currentPermission = this.currentKnowledgePermissions.find(p => p.userId === member._id)?.permission;

    if (!currentPermission || currentPermission !== permission) {
      if (member._id !== this.knowledge.createdBy) {
        this.memberPermissions[member._id] = permission;
        this.updatePermissionsInDatabase(member, permission);
      }
    }
  }

  applyPermissionsChanges() {
    this.members.forEach(member => {
      const existingPermission = this.currentKnowledgePermissions.find(p => p.userId === member._id);
      if (existingPermission) {
        existingPermission.permission = this.memberPermissions[member._id];
      }
    });
  }

  updatePermissionsInDatabase(member: IUser, permission: 'Reader' | 'Editor') {
    if (member._id === this.knowledge.createdBy) {
      return;
    }
    const existingPermission = this.knowledge?.permissions.find(p => p.userId === member._id);

    if (existingPermission) {
      existingPermission.permission = permission;
    } else {
      this.knowledge.permissions.push({ userId: member._id, permission });
    }

    this.knowledgeBaseService.update(this.knowledge).subscribe({
      next: () => this.notificationsService.show('Successfully updated knowledge'),
      error: (error) => this.handleError(error)
    });
  }

  handleError(error: any) {
    if (error.status === 403 && error.error?.message === 'Cannot change creator permission') {
      console.log('You do not have permission to perform this task');
      this.notificationsService.show('You do not have permission to perform this task');
    } else {
      console.error('Error updating knowledge:', error);
      this.notificationsService.show('Error updating knowledge. Please try again.');
    }
  }

  updatedTimeDifference(updatedAt: Date | undefined): string {
    if (!updatedAt) {
      return 'N/A';
    }

    const diffMilliseconds = new Date().getTime() - new Date(updatedAt).getTime();
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

  handleKnowledgeEdited() {
    this.loadKnowledgeBase(this.workspace._id);
  }

  handleKnowledgeDeleted() {
    this.loadKnowledgeBase(this.workspace._id);
  }

  capitalizeName(name: string): string {
    return name
      .toLowerCase()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
}
