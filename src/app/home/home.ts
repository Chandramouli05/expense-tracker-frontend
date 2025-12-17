import { Component } from '@angular/core';
import { AddExpenseComponent } from '../add-expense.component/add-expense.component';

@Component({
  selector: 'app-home',
  imports: [AddExpenseComponent],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {}
