import { Component, computed, effect, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

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

  constructor(private route: Router, private fb: FormBuilder) {
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

    const { email, password } = this.myForm.value;
    if (email === 'admin@gmail.com' && password === 'Admin@1234') {
      this.success.set(true);
      this.successMsg.set('Login Successful');
      setTimeout(() => {
        this.success.set(false);
        this.route.navigate(['/home']);
      }, 4000);
    } else {
      this.error.set(true);
      this.errorMsg.set('Invalid Email or Password');

      setTimeout(() => {
        this.error.set(false);
      }, 4000);
    }

    console.log(this.myForm.value);
  }
}
