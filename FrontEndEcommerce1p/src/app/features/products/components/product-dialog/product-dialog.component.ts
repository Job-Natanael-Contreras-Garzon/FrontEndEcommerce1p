import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Product } from '../../../../core/models/product.model';

@Component({
  selector: 'app-product-dialog',
  templateUrl: './product-dialog.component.html',
  styleUrls: ['./product-dialog.component.scss']
})
export class ProductDialogComponent implements OnInit {
  form: FormGroup;
  isLoading = false;
  isEdit = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ProductDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: Product
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      category: ['', Validators.required],
      stock: ['', [Validators.required, Validators.min(0)]],
      imageUrl: ['', Validators.required]
    });

    if (data) {
      this.isEdit = true;
      this.form.patchValue(data);
    }
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  getErrorMessage(controlName: string): string {
    const control = this.form.get(controlName);
    if (!control) return '';

    if (control.hasError('required')) {
      return 'This field is required';
    }

    if (control.hasError('minlength')) {
      return `Minimum length is ${control.getError('minlength').requiredLength} characters`;
    }

    if (control.hasError('min')) {
      return `Value must be greater than or equal to ${control.getError('min').min}`;
    }

    return '';
  }
}