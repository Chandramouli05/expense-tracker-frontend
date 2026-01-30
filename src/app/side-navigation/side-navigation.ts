import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { SidebarService } from '../services/sidebar-service';
import { AuthService } from '../services/auth-service/auth-service';

@Component({
  selector: 'app-side-navigation',
  imports: [CommonModule, RouterModule],
  templateUrl: './side-navigation.html',
  styleUrl: './side-navigation.scss',
})
export class SideNavigation {
  isSidebarOpen = signal(false);

  constructor(
    private route: Router,
    public sideBar: SidebarService,
    public authService: AuthService,
  ) {}

  toggleSidebar() {
    this.sideBar.toggle();
  }

  logout() {
    if (confirm('Do you want to logout?')) {
      this.authService.logout().subscribe(() => {
        this.route.navigate(['/login'], { replaceUrl: true });
      });
    }
  }
}
