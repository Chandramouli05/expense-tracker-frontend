import { Routes } from '@angular/router';
import { LoginComponent } from './login.component/login.component';
import { AddExpenseComponent } from './add-expense.component/add-expense.component';
import { SignupComponent } from './signup.component/signup.component';
import { ViewExpenseComponent } from './view-expense.component/view-expense.component';
import { Home } from './home/home';
import { authGuard } from './auth-guard';
import { Dashboard } from './dashboard/dashboard';
import { Categories } from './categories/categories';
import { Budgets } from './budgets/budgets';
import { Reports } from './reports/reports';
import { Expenses } from './expenses/expenses';
import { Notifications } from './notifications/notifications';

export const routes: Routes = [
  { path: '', component: LoginComponent },

  { path: 'dashboard', component: Dashboard, canActivate: [authGuard] },
  { path: 'add-expense', component: AddExpenseComponent },
  { path: 'expenses', component: Expenses },
  { path: 'categories', component: Categories },
  { path: 'budgets', component: Budgets },
  { path: 'reports', component: Reports },
  { path: 'notifications', component: Notifications },

  { path: 'login', component: LoginComponent },
  { path: 'sign-up', component: SignupComponent },
  { path: 'view-expense', component: ViewExpenseComponent },
  { path: '**', redirectTo: 'login' },
];
