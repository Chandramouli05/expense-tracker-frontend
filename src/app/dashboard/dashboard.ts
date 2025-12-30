import { Component } from '@angular/core';
import { Header } from '../header/header';
import { SideNavigation } from '../side-navigation/side-navigation';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [Header, SideNavigation, CommonModule, RouterLink],
  standalone: true,
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
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
}
