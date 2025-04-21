import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { AdminLayoutComponent } from './admin-layout.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';

@NgModule({
  declarations: [AdminLayoutComponent, SidebarComponent],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule
  ],
  exports: [AdminLayoutComponent, SidebarComponent]
})
export class AdminLayoutModule { }