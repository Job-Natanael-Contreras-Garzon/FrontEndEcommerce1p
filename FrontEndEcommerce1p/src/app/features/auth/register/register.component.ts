// src/app/features/auth/register/register.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService, RegisterResponse } from '../../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  loading = false;
  submitted = false;
  error = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  get f() {
    return this.registerForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    this.error = '';
    this.successMessage = '';

    if (this.registerForm.invalid) {
      return;
    }
    this.loading = true;
    const registerData = {
      username: this.registerForm.value.username,
      email: this.registerForm.value.email,
      password: this.registerForm.value.password,
    };
    this.auth.register(registerData).subscribe({
      next: (response: RegisterResponse) => {
        this.loading = false;
        if (response.user_id) {
          this.successMessage = 'Registro exitoso. Por favor inicia sesión.';
          this.router.navigate(['/auth/login/login']);
        } else {
          this.error = response.message || 'Error en registro';
        }
      },
      error: (err: any) => {
        this.loading = false;
        this.error = err.error?.message || 'Error en registro';
      },
    });
  }
}