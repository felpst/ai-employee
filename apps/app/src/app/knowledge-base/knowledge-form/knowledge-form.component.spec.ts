import { ComponentFixture, TestBed } from '@angular/core/testing';
import { KnowledgeFormComponent } from './knowledge-form.component';

describe('KnowledgeFormComponent', () => {
  let component: KnowledgeFormComponent;
  let fixture: ComponentFixture<KnowledgeFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [KnowledgeFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(KnowledgeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
