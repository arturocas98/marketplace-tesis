import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { LoginAuthComponent } from './login-auth/login-auth.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [LoginAuthComponent],
  imports: [
    CommonModule,
    AuthRoutingModule,
    ReactiveFormsModule,
  ]
})
export class AuthModule { }
