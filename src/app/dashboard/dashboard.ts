import { Component } from '@angular/core';
import { Header } from '../header/header';
import { SideNavigation } from '../side-navigation/side-navigation';

@Component({
  selector: 'app-dashboard',
  imports: [Header,SideNavigation],
  standalone:true,
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {

}
