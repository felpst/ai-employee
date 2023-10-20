import { Component, OnInit } from '@angular/core';
import { IAIEmployee } from '@cognum/interfaces';
import { EmployeeService } from './ai-employee.service';

@Component({
  selector: 'cognum-ai-employee',
  templateUrl: './ai-employee.component.html',
  styleUrls: ['./ai-employee.component.scss'],

})
export class AiEmployeeComponent implements OnInit {
  employees: IAIEmployee[] = [];

  constructor(private employeeService: EmployeeService) { }

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
}
