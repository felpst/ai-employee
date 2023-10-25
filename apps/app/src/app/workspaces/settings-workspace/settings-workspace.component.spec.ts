import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsWorkspaceComponent } from './settings-workspace.component';

describe('SettingsWorkspaceComponent', () => {
  let component: SettingsWorkspaceComponent;
  let fixture: ComponentFixture<SettingsWorkspaceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SettingsWorkspaceComponent],
    });
    fixture = TestBed.createComponent(SettingsWorkspaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
