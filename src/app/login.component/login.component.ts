import { Component, computed, effect, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login.component',
  imports: [RouterLink],
  standalone: true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  email = signal(' ');
  password = signal(' ');

  error = signal(false);
  errorMsg = signal('');

  success = signal(false);
  successMsg = signal('');

  emailValid = computed(() => this.email().includes('@') && this.email().length > 5);
  passwordValid = computed(() => this.password().length >= 8);

  formValid = computed(() => this.emailValid() && this.passwordValid());

  constructor(private router: Router) {
    effect(() => console.log('Form Valid:', this.formValid()));
  }

  submit() {
    if (!this.formValid()) {
      this.error.set(true);

      this.errorMsg.set('Login Fail ! Please check the details once before submitting 😯');

      setTimeout(() => {
        this.error.set(false);
      }, 4000);
      return;
    }

    console.log({
      email: this.email(),
      password: this.password(),
    });

    if (this.email() === 'admin@gmail.com' && this.password() === '12345678') {
      this.success.set(true);
      this.successMsg.set('Login Successful!✅🔓');

      setTimeout(() => {
        this.router.navigate(['/home']);
      }, 3000);
    }
  }
}
