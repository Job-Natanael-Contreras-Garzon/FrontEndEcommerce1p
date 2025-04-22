// src/app/features/auth/login/login.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loading = false;
  submitted = false;
  error = '';
  hidePassword = true;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    if (this.auth.isAuthenticated()) {
      this.router.navigate(['/panel/dashboard']);
    }
  }

  get f() {
    return this.loginForm.controls;
  }

  togglePasswordVisibility(event: MouseEvent): void {
    event.preventDefault();
    this.hidePassword = !this.hidePassword;
  }

  onSubmit(): void {
    this.submitted = true;
    this.error = '';

    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    const loginData = {
      email: this.loginForm.value.email.trim(),
      password: this.loginForm.value.password
    };
    
    this.auth.login(loginData.email, loginData.password).subscribe({
      next: (response) => {
        this.loading = false;
        if (response.token) {
          this.router.navigate(['/panel/dashboard'])
            .then(() => console.log('Navigation successful'))
            .catch(err => console.error('Navigation error:', err));
        } else {
          this.error = response.message || 'Error en el inicio de sesión';
        }
      },
      error: (err) => {
        this.loading = false;
        console.error('Login error:', err);
        if (err.status === 500) {
          this.error = 'Error interno del servidor. Por favor, intente más tarde.';
        } else {
          this.error = err.error?.message || 'Error en el inicio de sesión';
        }
      }
    });
  }
}