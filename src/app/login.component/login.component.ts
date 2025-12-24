import { Component, computed, effect, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth-service/auth-service';

@Component({
  selector: 'app-login.component',
  imports: [RouterLink, ReactiveFormsModule],
  standalone: true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  myForm!: FormGroup;

  error = signal(false);
  errorMsg = signal('');
  success = signal(false);
  successMsg = signal('');

  showForgotModal = signal(false);
  fwdEmail = signal('');

  constructor(private route: Router, private fb: FormBuilder, private authService: AuthService) {
    this.myForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.myForm.invalid) {
      this.error.set(true);
      this.errorMsg.set('Login Invalid! check Email/Password');
      setTimeout(() => {
        this.error.set(false);
      }, 4000);
      return;
    }

    this.authService.login(this.myForm.value).subscribe({
      next: (res: any) => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('firstName', JSON.stringify(res.user.firstName));

        this.success.set(true);
        this.successMsg.set('Login Successful');
        setTimeout(() => {
          this.success.set(false);
          this.route.navigate(['/dashboard'], { replaceUrl: true });
        }, 2000);
      },
      error: (err) => {
        this.error.set(true);
        this.errorMsg.set(err.error?.message || 'Invalid Email or Password');

        setTimeout(() => {
          this.error.set(false);
        }, 4000);
      },
    });
  }

  openModal() {
    console.log('working');
    this.error.set(false);
    this.showForgotModal.set(true);
  }

  closeModal() {
    this.showForgotModal.set(false);
    this.fwdEmail.set('');
  }

  sendResetLink() {
    if (this.fwdEmail().trim() === '') {
      this.error.set(true);
      this.errorMsg.set('Please Enter Email!');

      setTimeout(() => {
        this.error.set(false);
      }, 3000);
      return;
    }

    this.fwdEmail();
    this.success.set(true);
    this.successMsg.set('Password reset link sent!');
    this.closeModal();

    setTimeout(() => {
      this.success.set(false);
    }, 4000);
  }
}
