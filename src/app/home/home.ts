import { Component, OnInit, signal } from '@angular/core';
import { AuthService } from '../services/auth-service/auth-service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { User } from '../models/user.model';

interface LoggedInUser {
  firstName: string;
  lastName: string;
  email: string;
}

@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {
  firstName = signal('');
  userList = [
    {
      name: 'chandramoulli',
      age: 24,
      city: 'chennai',
    },
  ];

  constructor(private authService: AuthService, private route: Router) {}

  ngOnInit(): void {
    let firstName = JSON.parse(localStorage.getItem('firstName') ?? '""');
    console.log(firstName);

    this.authService.getUser().subscribe({
      next: () => {
        this.firstName.set(firstName!);
      },
      error: (err) => {
        console.error('GET USER ERROR:', err);
        console.log('user not authenticated');
      },
    });
  }

  logout() {
    if (confirm('Do you want to logout?')) {
      localStorage.removeItem('token');
      this.route.navigate(['/login'], { replaceUrl: true });
    }
  }
}
