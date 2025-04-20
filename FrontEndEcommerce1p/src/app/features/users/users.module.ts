import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserTableComponent } from './components/user-table/user-table.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [UserTableComponent],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    RouterModule.forChild([
      { path: '', component: UserTableComponent }
    ])
  ]
})
export class UsersModule { }