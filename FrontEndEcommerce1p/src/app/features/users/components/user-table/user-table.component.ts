import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../../../core/services/users.service';
import { Users } from '../../../../core/models/users.model';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-user-table',
  templateUrl: './user-table.component.html',
  styleUrls: ['./user-table.component.scss']
})
export class UserTableComponent implements OnInit {
  users: Users[] = [];
  loading = false;
  error = '';
  selectedRole = '';

  page = 1;
  pageSize = 5;
  total = 0;
  pages: number[] = [];

  roles = ['admin', 'user'];

  constructor(private usersService: UsersService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.loading = true;
    this.usersService.getUsers(this.page, this.pageSize, this.selectedRole).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.users = response.data.users;
          this.total = response.data.total;
          this.calcPages();
        } else {
          this.error = response.message || 'Error loading users';
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message;
        this.loading = false;
      }
    });
  }

  calcPages() {
    this.pages = Array.from(
      { length: Math.max(1, Math.ceil(this.total / this.pageSize)) },
      (_, i) => i + 1
    );
  }

  onRoleChange(role: string) {
    this.selectedRole = role;
    this.page = 1;
    this.loadUsers();
  }

  prevPage() {
    if (this.page > 1) {
      this.page--;
      this.loadUsers();
    }
  }

  nextPage() {
    if (this.page < this.pages.length) {
      this.page++;
      this.loadUsers();
    }
  }

  goToPage(p: number) {
    this.page = p;
    this.loadUsers();
  }

  addUser() {
    // TODO: Implementar diálogo de añadir usuario
  }

  editUser(user: Users) {
    // TODO: Implementar edición de usuario
  }

  deleteUser(user: Users) {
    if (confirm(`¿Eliminar usuario ${user.username}?`)) {
      this.usersService.deleteUser(user.id).subscribe({
        next: () => this.loadUsers(),
        error: (err) => this.error = err.message
      });
    }
  }

  exportExcel() {
    if (!this.users.length) {
      return;
    }

    const data = this.users.map(u => ({
      ID: u.id,
      Username: u.username,
      Email: u.email,
      Role: u.role
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Users');
    XLSX.writeFile(wb, 'users.xlsx');
  }
}