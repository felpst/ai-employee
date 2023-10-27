import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IWorkspace } from '@cognum/interfaces';
import { AuthService } from '../../auth/auth.service';
import { UsersService } from '../../services/users/users.service';
import { WorkspacesService } from '../workspaces.service';

@Component({
  selector: 'cognum-settings-workspace',
  templateUrl: './settings-workspace.component.html',
  styleUrls: ['./settings-workspace.component.scss'],
})
export class SettingsWorkspaceComponent implements OnInit {
  @ViewChild('overviewContainer', { static: true })
  private overviewContainer!: ElementRef<HTMLDivElement>;
  selectedItem: number | null = 1;
  image = '';
  name = '';
  workspace!: IWorkspace | null;
  isLoading = true;
  workspaceData = '@cognum/selected-workspace';
  workspacesId!: string;

  workspaceName!: string;
  workspacePhoto = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private usersService: UsersService,
    private workspacesService: WorkspacesService
  ) {
    this.route.params.subscribe((params) => {
      this.workspacesId = params['id'];
      this.getWorkspace();
    });
  }

  ngOnInit(): void {
    const userId = this.authService.user?._id;

    this.usersService.create(userId).subscribe({
      next: (response: any) => {
        this.image = response.profilePhoto;
        this.name = response.name;
      },
    });

    this.workspacesService.get(this.workspacesId).subscribe({
      next: (response) => {
        console.log(response);
        this.workspaceName = response.name;
      },
    });

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

  getWorkspace() {
    this.isLoading = true;
    return this.workspacesService
      .get(this.workspaceId)
      .subscribe((workspace) => {
        this.workspace = workspace;
        this.isLoading = false;
      });
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
