import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { AlertComponent } from './components/alert/alert.component';
import { DateFormatPipe } from './pipes/date-format.pipe';
import { HasRoleDirective } from './directives/has-role.directive';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    AlertComponent,
    DateFormatPipe,
    HasRoleDirective
  ],
  imports: [CommonModule, RouterModule],
  exports: [HeaderComponent, FooterComponent, AlertComponent, DateFormatPipe, HasRoleDirective]
})
export class SharedModule { }
