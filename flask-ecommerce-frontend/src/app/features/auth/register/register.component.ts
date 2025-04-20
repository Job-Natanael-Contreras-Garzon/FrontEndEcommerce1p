import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';
import { AlertService } from '../../../shared/components/alert/alert.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  loading = false;
  submitted = false;
  hidePassword = true;
  hideConfirm = true;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private alertService: AlertService
  ) {}

  ngOnInit() {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      password_confirmation: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(fg: FormGroup) {
    const p = fg.get('password')?.value;
    const cp = fg.get('password_confirmation')?.value;
    return p === cp ? null : { passwordMismatch: true };
  }

  get f() { return this.registerForm.controls; }

  onSubmit() {
    this.submitted = true;
    if (this.registerForm.invalid) return;
    this.loading = true;
    this.alertService.clear();
    this.authService.register(this.registerForm.value).subscribe({
      next: () => {
        this.alertService.success('Registro exitoso');
        this.router.navigate(['/auth/login'], { queryParams: { registered:'true' } });
      },
      error: err => {
        const errs = err.error?.errors
          ? Object.values(err.error.errors).flat().join('. ')
          : err.error?.message ?? 'Error al registrar usuario';
        this.alertService.error(errs);
        this.loading = false;
      }
    });
  }

  toggle(field: 'password'|'confirm') {
    if (field === 'password') this.hidePassword = !this.hidePassword;
    else this.hideConfirm = !this.hideConfirm;
  }
}
