/* eslint-disable @typescript-eslint/ban-ts-comment */
import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../../auth/auth.service';
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
  workspaceData = '@cognum/selected-workspace';

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
    private workspacesService: WorkspacesService,
    private authService: AuthService,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private cookieService: CookieService,
    private route: ActivatedRoute
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    iconRegistry.addSvgIcon(
      'cognum',
      sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/cognum.svg')
    );
  }

  get user() {
    return this.authService.user;
  }

  get workspace() {
    return this.workspacesService.selectedWorkspace;
  }

  // TODO
  get workspaceUsage() {
    return 25;
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
