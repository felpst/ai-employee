import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JobSettingsFormComponent } from './job-settings-form.component';

describe('JobSettingsFormComponent', () => {
  let component: JobSettingsFormComponent;
  let fixture: ComponentFixture<JobSettingsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [JobSettingsFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(JobSettingsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
