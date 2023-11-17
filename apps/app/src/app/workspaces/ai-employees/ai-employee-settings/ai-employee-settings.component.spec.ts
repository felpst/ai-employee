import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AIEmployeeSettingsComponent } from './ai-employee-settings.component';

describe('AiEmployeeComponent', () => {
  let component: AIEmployeeSettingsComponent;
  let fixture: ComponentFixture<AIEmployeeSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AIEmployeeSettingsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AIEmployeeSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
