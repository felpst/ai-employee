/* eslint-disable @typescript-eslint/ban-ts-comment */
import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { IUser } from '@cognum/interfaces';
import { CookieService } from 'ngx-cookie-service';
import { forkJoin } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { SettingsService } from '../../settings/settings.service';
import { WorkspacesService } from '../../workspaces/workspaces.service';

@Component({
  selector: 'cognum-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnDestroy {
  mobileQuery: MediaQueryList;
  isLoading = true;
  showMenu = false;
  showAllUsers = false;
  usersId: any = [];
  workspaceData = '@cognum/selected-workspace';
  profilePhoto = '';
  userName = '';
  background: string;
  remainingUsersCount = 0;

  menuItems = [
    {
      path: 'overview',
      text: 'Overview',
      icon: '../../../assets/icons/home.svg',
    },
    {
      path: 'employees',
      text: 'Employees',
      icon: '../../../assets/icons/robot.svg',
    },
    {
      path: 'history',
      text: 'History',
      icon: '../../../assets/icons/clock.svg',
    },
    {
      path: 'knowledge-base',
      text: 'Knowledge Base',
      icon: '../../../assets/icons/database.svg',
    },
  ];

  private _mobileQueryListener: () => void;

  constructor(
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
    private router: Router,
    private settingsService: SettingsService,
    private workspacesService: WorkspacesService,
    private authService: AuthService,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private cookieService: CookieService,
    private route: ActivatedRoute,
    private cdRef: ChangeDetectorRef
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    iconRegistry.addSvgIcon(
      'cognum',
      sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/cognum.svg')
    );
    this.background = this.getRandomColorFromSet();
  }

  getInitials(userName: string): string {
    if (userName) {
      const names = userName.split(' ');
      const initials = names[0][0] + (names[1] ? names[1][0] : '');
      return initials.toUpperCase();
    }
    return '';
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
    const randomIndex = Math.floor(Math.random() * predefinedColors.length);
    return predefinedColors[randomIndex];
  }

  onRedirect() {
    this.router.navigate(['/settings/workspaces']);
  }

  loadProfilePhotos() {
    const userRequests = this.usersId.map((userId: string) =>
      this.settingsService.getUserById(userId)
    );

    forkJoin(userRequests).subscribe((users: any) => {
      this.usersId = users.map((user: IUser) => ({
        ...user,
        photo: user.photo,
        name: user.name,
      }));
      this.calculateRemainingUsersCount();
    });
  }

  calculateRemainingUsersCount() {
    this.remainingUsersCount = Math.max(this.usersId.length - 2, 0);
  }

  ngOnInit(): void {
    this.workspacesService.get(this.workspace._id).subscribe((data) => {
      this.usersId = data.users;
      this.loadProfilePhotos();
    });
  }

  get user() {
    return this.authService.user;
  }

  get workspace() {
    return this.workspacesService.selectedWorkspace;
  }

  // TODO
  get workspaceUsage() {
    return 30;
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  toggleMenu() {
    this.showMenu = !this.showMenu;
  }

  onLogOut() {
    this.authService.logout().subscribe({
      next: () => {
        this.cookieService.delete('token');
        this.router.navigate(['/auth']);
      },
    });
  }
}
