import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UsersAvatarComponent } from './users-avatar.component';

describe('UsersAvatarComponent', () => {
  let component: UsersAvatarComponent;
  let fixture: ComponentFixture<UsersAvatarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UsersAvatarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UsersAvatarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
