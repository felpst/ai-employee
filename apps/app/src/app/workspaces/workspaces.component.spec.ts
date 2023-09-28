import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkspacesComponent } from './workspaces.component';

describe('WorkspacesComponent', () => {
  let component: WorkspacesComponent;
  let fixture: ComponentFixture<WorkspacesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WorkspacesComponent],
    });
    fixture = TestBed.createComponent(WorkspacesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
