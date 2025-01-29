import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SharedModule } from '../shared/shared.module';
import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './login/login.component';
import { InsertEmailComponent } from './recover/insert-email.component';
import { RecoverComponent } from './recover/new-password/new-password.component';
import { RegisterComponent } from './register/register.component';
import { ValidateComponent } from './validate/validate.component';

@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    RecoverComponent,
    InsertEmailComponent,
    ValidateComponent,
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatInputModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    SharedModule,
  ],
})
export class AuthModule {}
