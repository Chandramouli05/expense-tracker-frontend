import { Component, computed, effect, OnInit, signal } from '@angular/core';
import { SidebarService } from '../services/sidebar-service';
import { AuthService } from '../services/auth-service/auth-service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterLink],
  standalone: true,
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  firstName = computed(() => this.authService.user()?.firstName);
  period = signal('');

  isSidebarOpen = signal(false);

  constructor(private authService: AuthService, public sideBar: SidebarService) {
    this.authService.getUser();

    effect(() => {
      this.authService.getUser().subscribe();
      this.getTimeOfDayMessage();
    });
  }

  toggleSidebar() {
    this.sideBar.toggle();
  }

  getTimeOfDayMessage() {
    const currentHour = new Date().getHours();

    if (currentHour >= 5 && currentHour < 12) {
      this.period.set('Good Morning 🌤️,');
    } else if (currentHour === 12) {
      this.period.set('Good Noon 🌞,');
    } else if (currentHour > 12 && currentHour < 17) {
      this.period.set('Good AfterNoon ⛱️ ,');
    } else if (currentHour >= 17 && currentHour < 21) {
      this.period.set('Good Evening 🌆,');
    } else {
      this.period.set('Hi! Night Owl🦉🌚, ');
    }

    return `You Logged in during the ${this.period}`;
  }
}
