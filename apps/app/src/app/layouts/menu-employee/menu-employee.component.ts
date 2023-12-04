/* eslint-disable @typescript-eslint/ban-ts-comment */
import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { IUser } from '@cognum/interfaces';
import { AuthService } from '../../auth/auth.service';
import { AIEmployeesService } from '../../workspaces/ai-employees/ai-employees.service';
import { WorkspacesService } from '../../workspaces/workspaces.service';

@Component({
  selector: 'cognum-menu-employee',
  templateUrl: './menu-employee.component.html',
  styleUrls: ['./menu-employee.component.scss'],
})
export class MenuEmployeeComponent implements OnDestroy {
  mobileQuery: MediaQueryList;
  isLoading = true;
  showMenu = false;
  showAllUsers = false;
  workspaceData = '@cognum/selected-workspace';

  private _mobileQueryListener: () => void;

  constructor(
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
    private router: Router,
    private workspacesService: WorkspacesService,
    private authService: AuthService,
    private employeesService: AIEmployeesService,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
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

  get users(): IUser[] {
    return this.workspacesService.selectedWorkspace.users.map(({ user }) => user) as IUser[]
  }

  get workspace() {
    return this.workspacesService.selectedWorkspace;
  }

  get employee() {
    return this.employeesService.aiEmployee;
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  onBack() {
    return this.router.navigate(['workspaces', this.workspace._id, 'ai-employees']);
  }


}
