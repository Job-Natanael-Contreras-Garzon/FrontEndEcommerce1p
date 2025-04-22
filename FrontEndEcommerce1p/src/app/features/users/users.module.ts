import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserTableComponent } from './components/user-table/user-table.component';
import { SharedModule } from '../../shared/shared.module';

// Material Imports
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [UserTableComponent],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    // Material Modules
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    RouterModule.forChild([
      { path: '', component: UserTableComponent }
    ])
  ]
})
export class UsersModule { }