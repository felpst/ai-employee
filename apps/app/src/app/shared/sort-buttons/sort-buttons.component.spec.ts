import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SortButtonsComponent } from './sort-buttons.component';

describe('SortButtonsComponent', () => {
  let component: SortButtonsComponent;
  let fixture: ComponentFixture<SortButtonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SortButtonsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SortButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
