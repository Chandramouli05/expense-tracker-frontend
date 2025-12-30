import { Component, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-expenses',
  imports: [RouterLink],
  templateUrl: './expenses.html',
  styleUrl: './expenses.scss',
})
export class Expenses {
  isSidebarOpen = signal(false);
  route: any;

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
