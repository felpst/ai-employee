import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NotificationsService } from '../../../services/notifications/notifications.service';
import { DialogComponent } from '../../../shared/dialog/dialog.component';
import { AIEmployeesService, IFileResponse } from '../ai-employees.service';
import { AIEmployeeFileManagerFormComponent } from './ai-employee-file-manager-form/ai-employee-file-manager-form.component';

@Component({
  selector: 'cognum-ai-employee-file-manager',
  templateUrl: './ai-employee-file-manager.component.html',
  styleUrls: ['./ai-employee-file-manager.component.scss'],
})
export class AIEmployeeFileManagerComponent implements OnInit {
  isLoading = true;
  files: File[] = [];
  displayedColumns: string[] = ['name', 'created_at', 'actions'];
  dataSource!: MatTableDataSource<File>;
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  constructor(
    private aiEmployeesService: AIEmployeesService,
    private dialog: MatDialog,
    private notificationsService: NotificationsService,
    private _router: Router
  ) {}

  ngOnInit(): void {
    this.loadFiles();
  }

  loadFiles() {
    this.isLoading = true;
    const id = this.aiEmployee._id || '';
    this.aiEmployeesService.listFiles(id).subscribe(
      async (response) => {
        const files = response.map((it) => this._convertToJSFile(it));
        this.files = files;
        this.dataSource = new MatTableDataSource<File>(files);
        this.dataSource.paginator = this.paginator;
        this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching files:', error);
        this.notificationsService.show(
          'Error searching for files, try again in a moment'
        );
        this.isLoading = false;
        this._router.navigate(['/']);
      }
    );
  }

  get aiEmployee() {
    return this.aiEmployeesService.aiEmployee;
  }

  get memory() {
    return this.aiEmployee.memory;
  }

  getStoragename(file: File) {
    const { name } = file;
    const parts = name.split('/');
    return parts[parts.length - 1];
  }

  getOriginalname(file: File) {
    const storageName = this.getStoragename(file);
    const [, originalname] = storageName.includes('_')
      ? storageName.split('_')
      : ['', storageName];
    return originalname || '';
  }

  deleteFile(file: File) {
    this.dialog
      .open(DialogComponent, {
        data: {
          title: 'Delete File',
          content: 'Are you sure you want to delete this File?',
          confirmText: 'Delete',
        },
      })
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          const storageName = this.getStoragename(file);
          this.aiEmployeesService
            .deleteFile(this.aiEmployee, storageName)
            .subscribe(
              () => {
                this.loadFiles();
                this.notificationsService.show('File deleted successfully');
              },
              (error) => {
                console.error(error);
                this.notificationsService.show(
                  'Error deleting file, please try again in a moment'
                );
              }
            );
        }
      });
  }

  downloadFile(file: File) {
    const blobUrl = URL.createObjectURL(file);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = this.getOriginalname(file);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  openForm() {
    this.dialog
      .open(AIEmployeeFileManagerFormComponent, {
        width: '420px',
      })
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          this.loadFiles();
        }
      });
  }

  private _convertToJSFile(fileResponse: IFileResponse) {
    const { contentType, data, lastModified, name } = fileResponse;
    const binaryString = Buffer.from(data, 'base64');
    const blob = new Blob([binaryString], {
      type: 'application/octet-stream',
    });
    const file = new File([blob], name, {
      type: contentType,
      lastModified: new Date(lastModified).getTime(),
    });
    return file;
  }
}
