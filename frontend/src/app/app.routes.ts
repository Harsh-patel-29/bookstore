import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { BookListComponent } from './pages/book-list/book-list';
import { BookDetailsComponent } from './pages/book-details/book-details';
import { CartComponent } from './pages/cart/cart';
import { CheckoutComponent } from './pages/checkout/checkout';
import { OrderHistoryComponent } from './pages/order-history/order-history';
import { UserProfileComponent } from './pages/user-profile/user-profile';
import { LoginComponent } from './pages/login/login';
import { RegisterComponent } from './pages/register/register';
import { AdminLoginComponent } from './pages/admin/admin-login/admin-login';
import { DashboardComponent } from './pages/admin/dashboard/dashboard';
import { ManageBooksComponent } from './pages/admin/manage-books/manage-books';
import { AddBookComponent } from './pages/admin/add-book/add-book';
import { ManageOrdersComponent } from './pages/admin/manage-orders/manage-orders';
import { ManageUsersComponent } from './pages/admin/manage-users/manage-users';
import { AdminGuard } from './guards/admin.guard';
import { NonAdminGuard } from './guards/non-admin.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [NonAdminGuard] },
  { path: 'books', component: BookListComponent, canActivate: [NonAdminGuard] },
  { path: 'book/:id', component: BookDetailsComponent, canActivate: [NonAdminGuard] },
  { path: 'cart', component: CartComponent, canActivate: [NonAdminGuard] },
  { path: 'checkout', component: CheckoutComponent, canActivate: [NonAdminGuard] },
  { path: 'orders', component: OrderHistoryComponent, canActivate: [NonAdminGuard] },
  { path: 'profile', component: UserProfileComponent, canActivate: [NonAdminGuard] },
  { path: 'login', component: LoginComponent, canActivate: [NonAdminGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [NonAdminGuard] },
  { path: 'admin/login', component: AdminLoginComponent },
  { path: 'admin/dashboard', component: DashboardComponent, canActivate: [AdminGuard] },
  { path: 'admin/books', component: ManageBooksComponent, canActivate: [AdminGuard] },
  { path: 'admin/add-book', component: AddBookComponent, canActivate: [AdminGuard] },
  { path: 'admin/edit-book/:id', component: AddBookComponent, canActivate: [AdminGuard] },
  { path: 'admin/orders', component: ManageOrdersComponent, canActivate: [AdminGuard] },
  { path: 'admin/users', component: ManageUsersComponent, canActivate: [AdminGuard] },
  { path: '**', redirectTo: '' }
];
