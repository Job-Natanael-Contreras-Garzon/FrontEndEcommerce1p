import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loading = false;
  submitted = false;
  returnUrl = '/';
  error = '';
  hidePassword = true;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
    
    // Get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    
    // Redirect if already logged in
    if (this.auth.isLoggedIn()) {
      this.router.navigate([this.returnUrl]);
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
      email: this.loginForm.value.email,
      password: this.loginForm.value.password
    };

    this.auth.login(loginData).subscribe({
      next: (response) => {
        if (response.status === 'success') {
          this.router.navigateByUrl(this.returnUrl);
        } else {
          this.error = response.message || 'Login failed';
          this.loading = false;
        }
      },
      error: (err) => {
        this.error = err.error?.message || 'Credenciales incorrectas';
        this.loading = false;
      }
    });
  }
}