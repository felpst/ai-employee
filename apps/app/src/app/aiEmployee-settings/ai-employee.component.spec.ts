import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AiEmployeeComponentSettings } from './ai-employee.component';

describe('AiEmployeeComponent', () => {
  let component: AiEmployeeComponentSettings;
  let fixture: ComponentFixture<AiEmployeeComponentSettings>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AiEmployeeComponentSettings],
    }).compileComponents();

    fixture = TestBed.createComponent(AiEmployeeComponentSettings);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
