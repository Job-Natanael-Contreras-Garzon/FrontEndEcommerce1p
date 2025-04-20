import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  loading = false;
  submitted = false;
  error = '';
  hidePassword = true;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
    
    // Redirect if already logged in
    if (this.auth.isLoggedIn()) {
      this.router.navigate(['/']);
    }
  }

  get f() {
    return this.registerForm.controls;
  }
  
  togglePasswordVisibility(event: MouseEvent): void {
    event.preventDefault();
    this.hidePassword = !this.hidePassword;
  }

  onSubmit() {
    this.submitted = true;
    this.error = '';
    
    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true;
    
    const registerData = {
      name: this.registerForm.value.name,
      email: this.registerForm.value.email,
      password: this.registerForm.value.password
    };

    this.auth.register(registerData).subscribe({
      next: (response) => {
        if (response.status === 'success') {
          // Registro exitoso, redirigir a login
          this.router.navigate(['/auth/login']);
        } else {
          this.error = response.message || 'Registration failed';
          this.loading = false;
        }
      },
      error: (err) => {
        this.error = err.error?.message || 'Error en el registro';
        this.loading = false;
      }
    });
  }
}