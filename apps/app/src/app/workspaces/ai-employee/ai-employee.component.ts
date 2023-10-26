import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { IAIEmployee } from '@cognum/interfaces';
import { DialogComponent } from '../../shared/dialog/dialog.component';
import { EmployeeService } from './ai-employee.service';
import { WorkspacesService } from '../workspaces.service';
import { WhiteAiEmployeeComponent } from './white-ai-employee/white-ai-employee.component';
import { AiEmployeeComponentSettings } from '../../settings/ai-employee/ai-employee.component'; 
import { Router } from '@angular/router';

@Component({
  selector: 'cognum-ai-employee',
  templateUrl: './ai-employee.component.html',
  styleUrls: ['./ai-employee.component.scss'],

})
export class AiEmployeeComponent implements OnInit {
  originalEmployees: IAIEmployee[] = [];
  employees: IAIEmployee[] = [];
  searchText = '';


  sortingType: 'newFirst' | 'oldFirst' | 'mix' = 'newFirst';
  sortingDirection: 'asc' | 'desc' = 'desc';
  activeButton = 'newFirst';

  constructor(
    private router: Router,
    private employeeService: EmployeeService,
    private workspacesService: WorkspacesService,
    private dialog: MatDialog)
   {}

  ngOnInit() {
    this.activeButton = '';
    this.loadEmployees();
  }

 
  loadEmployees() {
    this.employeeService.list().subscribe(
      employees => {
        this.originalEmployees = employees;
        this.filterEmployees();
      },
      error => {
        console.error(error);
      }
    );
  }


  createEmployee() {
    const dialogRef = this.dialog.open(WhiteAiEmployeeComponent, {
      height: '80%',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'success') {
        this.loadEmployees(); 
        this.activeButton = '';
      }
    });
  }

  editEmployee(employee: IAIEmployee) {
    const employeeId = employee._id; // Obtendo o ID do funcionário
    console.log(employeeId)
    const employees= this.router.navigate(['/employee', employeeId]);
    console.log(employees)
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
              this.employees = this.employees.filter(emp => emp._id !== employee._id);
              console.log('Funcionário excluído:', employee);
            },
            error => {
              console.error(error);
            }
          );
        }
      });
  }
  

  filterEmployees() {
    this.employees = this.originalEmployees.filter(employee =>
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
}
