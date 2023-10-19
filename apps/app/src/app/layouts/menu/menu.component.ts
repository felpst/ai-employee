import { MediaMatcher } from '@angular/cdk/layout';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { IWorkspace } from '@cognum/interfaces';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../../auth/auth.service';
import { WorkspacesService } from '../../workspaces/workspaces.service';

@Component({
  selector: 'cognum-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit, OnDestroy {
  @ViewChild('overviewContainer', { static: true })
  private overviewContainer!: ElementRef<HTMLDivElement>;
  workspace!: IWorkspace | null;
  mobileQuery: MediaQueryList;
  isLoading = true;
  workspaceData = '@cognum/selected-workspace';

  private _mobileQueryListener: () => void;

  constructor(
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
    private router: Router,
    private workspacesService: WorkspacesService,
    private authService: AuthService,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private cookieService: CookieService
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    iconRegistry.addSvgIcon(
      'cognum',
      sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/cognum.svg')
    );
  }

  ngOnInit(): void {
    const workspaces = this.workspacesService.workspaces;
    this.overviewContainer.nativeElement.classList.add('active');
    if (workspaces.size === 0) {
      return this.onLoadList();
    } else {
      this.workspace =
        this.workspacesService.workspaces.get(this.workspaceId) || null;
      this.isLoading = false;
    }
  }

  onLoadList() {
    this.workspacesService.list().subscribe((data) => {
      const workspace = data.get(this.workspaceId) || null;
      this.workspace = workspace;
      this.isLoading = false;
    });
  }

  get username() {
    return this.authService.user?.name || '';
  }

  get name() {
    return this.workspace?.name || 'Workspace';
  }

  get userPhoto() {
    return (
      this.authService.user?.profilePhoto || '../../../assets/icons/avatar.svg'
    );
  }

  get photo() {
    return this.workspace?.workspacePhoto || '../../../assets/icons/avatar.svg';
  }

  get workspaceId() {
    return localStorage.getItem(this.workspaceData) || '';
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
    localStorage.removeItem(this.workspaceData);
  }

  onLink(url: string) {
    this.router.navigate([url]);
  }

  onItemChange(selected: string) {
    const ids = [
      'menu-overview',
      'menu-employees',
      'menu-history',
      'menu-knowledge',
    ];
    ids.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        if (id === selected) element.classList.add('active');
        else element.classList.remove('active');
      }
    });
  }

  onReturn() {
    return this.router.navigate(['/home']);
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
