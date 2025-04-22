import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';
import { Users, CreateUsersDTO, UpdateUsersDTO } from '../models/users.model';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  // Datos de prueba
  private mockUsers: Users[] = [
    {
      id: 1,
      username: 'admin',
      email: 'admin@example.com',
      role: 'admin'
    },
    {
      id: 2,
      username: 'usuario1',
      email: 'usuario1@example.com',
      role: 'user'
    },
    {
      id: 3,
      username: 'usuario2',
      email: 'usuario2@example.com',
      role: 'user'
    }
  ];

  constructor(private http: HttpClient) {}

  getUsers(page: number = 1, limit: number = 10, role?: string): Observable<ApiResponse<{ users: Users[], total: number }>> {
    let filteredUsers = this.mockUsers;
    if (role) {
      filteredUsers = this.mockUsers.filter(user => user.role === role);
    }
    
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedUsers = filteredUsers.slice(start, end);

    return of({
      success: true,
      data: {
        users: paginatedUsers,
        total: filteredUsers.length
      },
      message: 'Users retrieved successfully'
    });
  }

  getUser(id: number): Observable<ApiResponse<Users>> {
    const user = this.mockUsers.find(u => u.id === id);
    if (user) {
      return of({
        success: true,
        data: user,
        message: 'User found'
      });
    }
    return throwError(() => new Error('User not found'));
  }

  createUser(userData: CreateUsersDTO): Observable<ApiResponse<Users>> {
    const newUser: Users = {
      id: this.mockUsers.length + 1,
      username: userData.username,
      email: userData.email,
      role: userData.role || 'user'
    };
    
    this.mockUsers.push(newUser);
    return of({
      success: true,
      data: newUser,
      message: 'User created successfully'
    });
  }

  updateUser(id: number, changes: UpdateUsersDTO): Observable<ApiResponse<{ message: string }>> {
    const index = this.mockUsers.findIndex(u => u.id === id);
    if (index !== -1) {
      this.mockUsers[index] = {
        ...this.mockUsers[index],
        ...changes
      };
      return of({
        success: true,
        message: 'User updated successfully'
      });
    }
    return throwError(() => new Error('User not found'));
  }

  deleteUser(id: number): Observable<ApiResponse<{ message: string }>> {
    const index = this.mockUsers.findIndex(u => u.id === id);
    if (index !== -1) {
      this.mockUsers.splice(index, 1);
      return of({
        success: true,
        message: 'User deleted successfully'
      });
    }
    return throwError(() => new Error('User not found'));
  }
}