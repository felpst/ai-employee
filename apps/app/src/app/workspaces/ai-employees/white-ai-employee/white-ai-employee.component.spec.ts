import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WhiteAiEmployeeComponent } from './white-ai-employee.component';

describe('WhiteAiEmployeeComponent', () => {
  let component: WhiteAiEmployeeComponent;
  let fixture: ComponentFixture<WhiteAiEmployeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WhiteAiEmployeeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WhiteAiEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
