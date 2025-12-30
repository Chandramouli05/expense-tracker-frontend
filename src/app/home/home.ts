import { Component, computed, OnInit, signal } from '@angular/core';
import { AuthService } from '../services/auth-service/auth-service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { User } from '../models/user.model';

interface LoggedInUser {
  firstName: string;
  lastName: string;
  email: string;
}

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  firstName = computed(() => this.authService.getUser().subscribe((value) => value.firstName));
  isSidebarOpen = signal(false);

  categories = [
    { name: 'Food', icon: '🍎' },
    { name: 'Rent', icon: '🏠' },
    { name: 'Transport', icon: '🚗' },
    { name: 'Shopping', icon: '🛍️' },
    { name: 'Entertainment', icon: '📚' },
  ];

  emiReminders = [
    {
      name: 'ICICI personal loan EMI',
      date: '5th Jan 2026',
      amount: '₹12,500',
      status: 'Upcoming',
      statusColor: 'bg-emerald-100 text-emerald-700',
    },
    {
      name: 'BIKE loan EMI',
      date: '27th Dec 2025',
      amount: '₹10,500',
      status: 'Due Soon',
      statusColor: 'bg-yellow-100 text-yellow-700',
    },
    {
      name: 'Credit Card EMI',
      date: '22nd Dec 2025',
      amount: '₹5000',
      status: 'Overdue',
      statusColor: 'bg-red-100 text-red-700',
    },
    {
      name: 'Phone EMI',
      date: '27th Dec 2025',
      amount: '₹2,500',
      status: 'Due Soon',
      statusColor: 'bg-yellow-100 text-yellow-700',
    },
  ];

  activities = [
    {
      name: 'Home Electricity Bill',
      status: 'Successful',
      date: '27 / 10 / 2025',
      amount: '₹450',
      statusColor: 'text-emerald-500',
    },
    {
      name: 'Festival Shopping',
      status: 'Pending',
      date: '27 / 10 / 2025',
      amount: '₹450',
      statusColor: 'text-yellow-500',
    },
    {
      name: 'Car Services',
      status: 'Successful',
      date: '27 / 10 / 2025',
      amount: '₹450',
      statusColor: 'text-emerald-500',
    },
  ];

  constructor(private authService: AuthService, private route: Router) {
    this.authService.getUser();
  }

  toggleSidebar() {
    this.isSidebarOpen.update((v) => !v);
  }

  logout() {
    if (confirm('Do you want to logout?')) {
      localStorage.removeItem('token');
      this.route.navigate(['/login'], { replaceUrl: true });
    }
  }
}
