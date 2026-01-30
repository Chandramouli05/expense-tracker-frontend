import { Routes } from '@angular/router';
import { LoginComponent } from './login.component/login.component';
import { AddExpenseComponent } from './add-expense.component/add-expense.component';
import { SignupComponent } from './signup.component/signup.component';
import { ViewExpenseComponent } from './view-expense.component/view-expense.component';
import { authGuard } from './auth-guard';
import { Dashboard } from './dashboard/dashboard';
import { Categories } from './categories/categories';
import { Budgets } from './budgets/budgets';
import { Reports } from './reports/reports';
import { EMIManagement } from './emi-management/reports';
import { Expenses } from './expenses/expenses';
import { BudgetResolver } from './resolvers/budget.resolver';
import { DashboardResolver } from './resolvers/dashboard.resolver';
import { ExpenseResolver } from './resolvers/expense.resolver';
import { CategoriesResolver } from './resolvers/categories.resolver';
import { EmiResolver } from './resolvers/emi.resolver';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  {
    path: 'dashboard',
    component: Dashboard,
    canActivate: [authGuard],
    resolve: { preload: DashboardResolver },
  },
  { path: 'add-expense', component: AddExpenseComponent },
  { path: 'expenses', component: Expenses, resolve: { preload: ExpenseResolver } },
  { path: 'categories', component: Categories, resolve: { preload: CategoriesResolver } },
  { path: 'budgets', component: Budgets, resolve: { preload: BudgetResolver } },
  { path: 'emi-management', component: EMIManagement, resolve: { preload: EmiResolver } },
  { path: 'reports', component: Reports },
  { path: 'login', component: LoginComponent },
  { path: 'sign-up', component: SignupComponent },
  { path: 'view-expense', component: ViewExpenseComponent },
  { path: '**', redirectTo: 'login' },
];
