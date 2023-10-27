import { Component, OnInit } from '@angular/core';
import { IUser } from '@cognum/interfaces';
import { WorkspacesService } from '../../../workspaces/workspaces.service';

interface Member {
  _id: string;
  initials: string;
  photo?: string;
  backgroundColor: string;
}

@Component({
  selector: 'cognum-workspace-members',
  templateUrl: './workspace-members.component.html',
  styleUrls: ['./workspace-members.component.scss'],
})
export class WorkspaceMembersComponent implements OnInit {
  members: Member[] = [];
  private _nextColor = 0;

  constructor(private workspacesService: WorkspacesService) {}

  ngOnInit(): void {
    this.loadMembers();
  }

  loadMembers() {
    for (const user of this.users) {
      this.members.push({
        _id: user._id,
        initials: user.name.charAt(0),
        photo: user.photo,
        backgroundColor: this.getRandomColorFromSet(),
      });
    }
  }

  get showMembers(): Member[] {
    return this.members.slice(0, 3);
  }

  get users(): IUser[] {
    return this.workspacesService.selectedWorkspace.users as IUser[];
  }

  get workspace() {
    return this.workspacesService.selectedWorkspace;
  }

  get remainingUsersCount(): number {
    return Math.max(this.members.length - 3, 0);
  }

  getRandomColorFromSet(): string {
    const predefinedColors = [
      '#22333B',
      '#0A0908',
      '#BFCC94',
      '#E6AACE',
      '#0D1821',
      '#344966',
      '#A9927D',
      '#5E503F',
      '#1C1F33',
      '#666370',
      '#D33E43',
    ];
    const color = predefinedColors[this._nextColor];
    this._nextColor = (this._nextColor + 1) % predefinedColors.length;
    return color;
  }
}
