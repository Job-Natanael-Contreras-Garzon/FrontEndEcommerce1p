//module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { AlertComponent } from './components/alert/alert.component';
import { DateFormatPipe } from './pipes/date-format.pipe';
import { HasRoleDirective } from './directives/has-role.directive';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatDialogModule
  ],
  declarations: [
    HeaderComponent,
    FooterComponent,
    AlertComponent,
    DateFormatPipe,
    HasRoleDirective
  ],
  exports: [
    CommonModule,
    RouterModule,
    HeaderComponent,
    FooterComponent,
    AlertComponent,
    DateFormatPipe,
    HasRoleDirective,
    MatIconModule,
    MatDialogModule
  ]
})
export class SharedModule { }