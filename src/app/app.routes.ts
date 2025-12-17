import { Routes } from '@angular/router';
import { LoginComponent } from './login.component/login.component';
import { AddExpenseComponent } from './add-expense.component/add-expense.component';
import { SignupComponent } from './signup.component/signup.component';
import { ViewExpenseComponent } from './view-expense.component/view-expense.component';
import { Home } from './home/home';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'home', component: Home },
  { path: 'add-expense', component: AddExpenseComponent },
  { path: 'login', component: LoginComponent },
  { path: 'sign-up', component: SignupComponent },
  { path: 'view-expense', component: ViewExpenseComponent },
];
