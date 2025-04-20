import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src//app/shared/shared.module';
import { AlertComponent } from 'src/app/shared/components/alert/alert.component';


@NgModule({
  declarations: [
    LoginComponent,
    AlertComponent
  ],
  imports:  [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    AuthRoutingModule
  ],
})
export class AuthModule { }
