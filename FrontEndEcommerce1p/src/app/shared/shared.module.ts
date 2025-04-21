//module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { AlertComponent } from './components/alert/alert.component';
import { DateFormatPipe } from './pipes/date-format.pipe';
import { HasRoleDirective } from './directives/has-role.directive';

// Material Modules
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatDialogModule,
    MatButtonModule,
    MatToolbarModule,
    MatCardModule
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
    // Export Material Modules
    MatIconModule,
    MatDialogModule,
    MatButtonModule,
    MatToolbarModule,
    MatCardModule
  ]
})
export class SharedModule { }