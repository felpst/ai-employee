import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CallsHistoryComponent } from './calls-history.component';

describe('CallsHistoryComponent', () => {
  let component: CallsHistoryComponent;
  let fixture: ComponentFixture<CallsHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CallsHistoryComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CallsHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
