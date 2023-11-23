import { Component, Input, OnInit } from '@angular/core';
import { IAIEmployee, IUser } from '@cognum/interfaces';

interface Avatar {
  _id: string;
  initials: string;
  photo?: string;
  backgroundColor: string;
  name: string;
}

@Component({
  selector: 'cognum-users-avatar',
  templateUrl: './users-avatar.component.html',
  styleUrls: ['./users-avatar.component.scss'],
})
export class UsersAvatarComponent implements OnInit {
  @Input() users: (IUser | IAIEmployee | any)[] = [];
  @Input() showAdd = false;

  avatars: Avatar[] = [];
  private _nextColor = 0;

  ngOnInit(): void {
    this.loadAvatars();
  }

  loadAvatars() {
    for (const user of this.users) {
      if (!user) continue;
      this.avatars.push({
        _id: user._id,
        initials: user.name?.charAt(0) || '',
        photo: this.imageURL(user),
        backgroundColor: this.getRandomColorFromSet(),
        name: user.name,
      });
    }
  }

  imageURL(agent: IUser | IAIEmployee): string {
    if (!agent) return ''
    if ('photo' in agent) {
      return agent.photo as string;
    } else if ('avatar' in agent) {
      return agent.avatar as string;
    }
    return ''
  }

  get showAvatars(): Avatar[] {
    return this.avatars.slice(0, 3);
  }

  get remainingUsersCount(): number {
    return Math.max(this.avatars.length - 3, 0);
  }

  getRandomColorFromSet(): string {
    const predefinedColors = [
      '#22333B',
      '#D33E43',
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
