import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../services/category-service';
import { Category } from '../models/categories.model';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SideNavigation } from '../side-navigation/side-navigation';
import { Header } from '../header/header';

@Component({
  selector: 'app-categories',
  imports: [CommonModule, RouterLink, SideNavigation, Header],
  standalone: true,
  templateUrl: './categories.html',
  styleUrl: './categories.scss',
})
export class Categories implements OnInit {
  categories: Category[] = [];
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

  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.categoryService.getCategories().subscribe();
  }

  addCategory() {
    const newCategory: Category = {
      name: 'Travel',
      icon: '✈️',
    };

    this.categoryService.postCategories(newCategory).subscribe({
      next: (res) => console.log(res),
      error: (err) => console.error(err),
    });
  }
}
