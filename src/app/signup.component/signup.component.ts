import { Component, computed, effect, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
  Validators,
  ValidatorFn,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';

@Component({
  selector: 'app-signup.component',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export class SignupComponent {
  myForm!: FormGroup;
  error = signal(false);
  errorMsg = signal('');

  success = signal(false);
  successMsg = signal('');

  constructor(private route: Router, private fb: FormBuilder) {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    this.myForm = this.fb.group(
      {
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: [
          '',
          [Validators.required, Validators.minLength(8), Validators.pattern(passwordRegex)],
        ],
        confirmPassword: ['', Validators.required],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  private passwordMatchValidator: ValidatorFn = (
    ctrl: AbstractControl
  ): ValidationErrors | null => {
    const password = ctrl.get('password');
    const confirmPassword = ctrl.get('confirmPassword');

    if (!password || !confirmPassword) return null;

    if (password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }

    confirmPassword.setErrors(null);
    return null;
  };

  onSubmit() {
    if (this.myForm.invalid) {
      this.error.set(true);
      this.errorMsg.set('Please fix the errors in the form.');
      setTimeout(() => {
        this.error.set(false);
      }, 6000);
      return;
    }

    this.success.set(true);
    this.successMsg.set(`Registration Successful`);
    setTimeout(() => {
      this.success.set(false);
      this.route.navigate(['/login']);
    });
    console.log(this.myForm.value);
  }
}
