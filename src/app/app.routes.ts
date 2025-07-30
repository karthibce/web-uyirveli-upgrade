import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login.component';
import { LayoutComponent } from './layout/layout.component';
import { HomeComponent } from './dashboard/home.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'dashboard',
    component: LayoutComponent,
    children: [
      { path: '',  component: HomeComponent },
      { path: 'customer', loadComponent: ()=> import('./dashboard/customer/customer-list.component').then(m => m.CustomerListComponent) },
      { path: 'order/:id/:phone', loadComponent: ()=> import('./dashboard/order/order.component').then(m => m.OrderComponent) }
      ]
  }
];
