import { ComponentFixture, TestBed } from '@angular/core/testing';
import {WorkspaceHistoryComponent} from './workspace-history.component';

describe('WorkspaceHistoryComponent', () => {
  let component:WorkspaceHistoryComponent;
  let fixture: ComponentFixture< WorkspaceHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkspaceHistoryComponent],
    }).compileComponents();

    fixture = TestBed.createComponent( WorkspaceHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
