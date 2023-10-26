import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AiEmployeeComponent } from './ai-employee.component';

describe('AiEmployeeComponent', () => {
  let component: AiEmployeeComponent;
  let fixture: ComponentFixture<AiEmployeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AiEmployeeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AiEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
