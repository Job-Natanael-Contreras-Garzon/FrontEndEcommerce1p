import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';
import { AlertService } from '../../../shared/components/alert/alert.service';

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
  hidePassword = true;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private alertService: AlertService
  ) {}

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
    this.authService.logout();
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    if (this.route.snapshot.queryParams['registered']) {
      this.alertService.success('Registro exitoso, ya puedes iniciar sesión');
    }
    if (this.route.snapshot.queryParams['expired']) {
      this.alertService.warning('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
    }
  }

  get f() { return this.loginForm.controls; }

  onSubmit() {
    this.submitted = true;
    if (this.loginForm.invalid) return;
    this.loading = true;
    this.alertService.clear();
    this.authService.login(this.loginForm.value).subscribe({
      next: () => {
        this.alertService.success('¡Bienvenido! Has iniciado sesión correctamente');
        this.router.navigate([this.returnUrl]);
      },
      error: err => {
        this.alertService.error(err.error?.message ?? 'Error al iniciar sesión. Verifica tus credenciales.');
        this.loading = false;
      }
    });
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }
}
