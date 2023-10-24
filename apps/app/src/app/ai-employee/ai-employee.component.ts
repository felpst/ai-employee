import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { IAIEmployee } from '@cognum/interfaces';
import { DialogComponent } from '../shared/dialog/dialog.component';
import { EmployeeService } from './ai-employee.service';
import { WhiteAiEmployeeComponent } from './white-ai-employee/white-ai-employee.component';

@Component({
  selector: 'cognum-ai-employee',
  templateUrl: './ai-employee.component.html',
  styleUrls: ['./ai-employee.component.scss'],

})
export class AiEmployeeComponent implements OnInit {
  employees: IAIEmployee[] = [];
  searchText = '';

  sortingType: 'newFirst' | 'oldFirst' | 'mix' = 'newFirst';
  sortingDirection: 'asc' | 'desc' = 'desc';
  activeButton = 'newFirst';

  constructor(
    private employeeService: EmployeeService,
    private dialog: MatDialog)
   {}

  ngOnInit() {
    this.loadEmployees();
  }

  loadEmployees() {
    this.employeeService.list().subscribe(
      employees => {
        this.employees = employees;
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

    dialogRef.afterClosed().subscribe(() => {});
    console.log('Editando funcionário:');
  }

  editEmployee(employee: IAIEmployee) {
    
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
  
  onSearch(event: any) {
    this.searchText = event.target.value;
    this.employees = this.employees.filter((employees) => {
      return employees.name.includes(this.searchText);
    });
  }

  clearSearch() {
    this.searchText = '';
    this.employees = this.employees;
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
