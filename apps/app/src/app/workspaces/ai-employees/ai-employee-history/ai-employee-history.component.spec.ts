import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AiEmployeeHistoryComponent } from './ai-employee-history.component';

describe('AiEmployeeHistoryComponent', () => {
  let component: AiEmployeeHistoryComponent;
  let fixture: ComponentFixture<AiEmployeeHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AiEmployeeHistoryComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AiEmployeeHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
