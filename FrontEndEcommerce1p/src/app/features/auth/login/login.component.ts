// src/app/features/auth/login/login.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { LoginResponse } from '../../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
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
      password: ['', Validators.required],
    });

    if (this.auth.isAuthenticated()) {
      this.router.navigate(['/panel']);
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
    
    const { email, password } = this.loginForm.value;
    this.auth.login(email, password).subscribe({
      next: (res) => { // Aquí no especificamos tipo para que TypeScript lo infiera
        this.loading = false;
        if (res.success && res.data?.token) {
          this.router.navigate(['/panel']);
        } else {
          this.error = res.message || 'Login failed';
        }
      },
      error: (err: any) => {
        this.loading = false;
        this.error = err.error?.message || 'Credenciales incorrectas';
      },
    });
  }}