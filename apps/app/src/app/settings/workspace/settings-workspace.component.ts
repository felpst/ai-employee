import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IWorkspace } from '@cognum/interfaces';
import { AuthService } from '../../auth/auth.service';
import { WorkspacesService } from '../../workspaces/workspaces.service';
import { SettingsService } from '../settings.service';

@Component({
  selector: 'cognum-settings-workspace',
  templateUrl: './settings-workspace.component.html',
  styleUrls: ['./settings-workspace.component.scss'],
})
export class SettingsWorkspaceComponent implements OnInit {
  constructor(
    private router: Router,
    private authService: AuthService,
    private settingsService: SettingsService,
    private workspacesService: WorkspacesService
  ) {}

  @ViewChild('overviewContainer', { static: true })
  private overviewContainer!: ElementRef<HTMLDivElement>;
  selectedItem: number | null = 2;
  image = '';
  name = '';
  workspace!: IWorkspace | null;
  isLoading = true;
  workspaceData = '@cognum/selected-workspace';

  ngOnInit(): void {
    const userId = this.authService.user?._id;

    this.settingsService.getUserById(userId).subscribe({
      next: (response) => {
        this.image = response.profilePhoto;
        this.name = response.name;
      },
    });

    const workspaces = this.workspacesService.workspaces;

    this.overviewContainer.nativeElement.classList.add('active');

    console.log(this.workspace);

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

  get workspaceId() {
    return localStorage.getItem(this.workspaceData) || '';
  }

  selectItem(itemNumber: number): void {
    this.selectedItem = itemNumber;
  }

  onRedirect() {
    return this.router.navigate(['/workspaces']);
  }
}
