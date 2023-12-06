import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MenuEmployeeComponent } from './menu-employee.component';

describe('MenuEmployeeComponent', () => {
  let component: MenuEmployeeComponent;
  let fixture: ComponentFixture<MenuEmployeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MenuEmployeeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MenuEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
