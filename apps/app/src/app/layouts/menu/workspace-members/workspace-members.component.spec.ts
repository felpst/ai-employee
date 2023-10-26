import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WorkspaceMembersComponent } from './workspace-members.component';

describe('WorkspaceMembersComponent', () => {
  let component: WorkspaceMembersComponent;
  let fixture: ComponentFixture<WorkspaceMembersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WorkspaceMembersComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WorkspaceMembersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
