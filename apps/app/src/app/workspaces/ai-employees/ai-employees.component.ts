import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { IAIEmployee } from '@cognum/interfaces';
import { DialogComponent } from '../../shared/dialog/dialog.component';
import { WorkspacesService } from '../workspaces.service';
import { AIEmployeesService } from './ai-employees.service';
import { WhiteAiEmployeeComponent } from './white-ai-employee/white-ai-employee.component';

@Component({
  selector: 'cognum-ai-employee',
  templateUrl: './ai-employees.component.html',
  styleUrls: ['./ai-employees.component.scss'],
})
export class AIEmployeesComponent implements OnInit {
  originalEmployees: IAIEmployee[] = [];
  employees: IAIEmployee[] = [];
  searchText = '';

  sortingType: 'newFirst' | 'oldFirst' | 'mix' = 'newFirst';
  sortingDirection: 'asc' | 'desc' = 'desc';
  activeButton = 'newFirst';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private employeeService: AIEmployeesService,
    private workspacesService: WorkspacesService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.activeButton = '';
    this.loadEmployees(this.workspace._id);
  }

  loadEmployees(workspaceId: string) {
    this.employeeService.listByWorkspace(workspaceId).subscribe(
      (employees) => {
        this.originalEmployees = employees;
        this.filterEmployees();
      },
      (error) => {
        console.error(error);
      }
    );
  }

  createEmployee() {
    const dialogRef = this.dialog.open(WhiteAiEmployeeComponent, {
      height: '75%',
      maxHeight: '650px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'success') {
        this.loadEmployees(this.workspace._id);
        this.activeButton = '';
      }
    });
  }

  editEmployee(employee: IAIEmployee) {
    const employeeId = employee._id;
    this.router.navigate([
      `workspaces/${this.workspace._id}/employee/${employeeId}`,
    ]);
  }

  deleteEmployee(employee: IAIEmployee) {
    this.dialog
      .open(DialogComponent, {
        data: {
          title: 'Delete AI Employee',
          content: 'Are you sure you want to delete this AI Employee?',
          confirmText: 'Delete',
        },
      })
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          this.employeeService.delete(employee).subscribe(
            () => {
              this.employees = this.employees.filter(
                (emp) => emp._id !== employee._id
              );
            },
            (error) => {
              console.error(error);
            }
          );
        }
      });
  }

  filterEmployees() {
    this.employees = this.originalEmployees.filter((employee) =>
      employee.name.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  onSearch(event: any) {
    this.searchText = event.target.value;
    this.filterEmployees();
  }

  clearSearch() {
    this.searchText = '';
    this.employees = this.originalEmployees;
  }

  sortKnowledgeBase(sortingCriterion: string) {
    if (sortingCriterion === 'newFirst') {
      this.sortingDirection = 'desc';
    } else if (sortingCriterion === 'oldFirst') {
      this.sortingDirection = 'asc';
    } else if (sortingCriterion === 'mix') {
      this.employees.sort(() => Math.random() - 0.5);
    } else {
      this.sortingDirection = 'desc';
    }

    if (sortingCriterion !== 'mix') {
      this.employees.sort((a: IAIEmployee, b: IAIEmployee) => {
        if (a.createdAt && b.createdAt) {
          const dateA = new Date(a.createdAt);
          const dateB = new Date(b.createdAt);

          const sortOrder = this.sortingDirection === 'asc' ? 1 : -1;

          if (dateA < dateB) {
            return -sortOrder;
          }
          if (dateA > dateB) {
            return sortOrder;
          }
        }
        return 0;
      });
    }
  }

  onButtonClick(button: string) {
    this.activeButton = button;
    this.sortKnowledgeBase(button);
  }

  get workspace() {
    return this.workspacesService.selectedWorkspace;
  }
}
