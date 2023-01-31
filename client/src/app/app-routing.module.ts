import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { AdminLoginComponent } from './modules/admin/components/admin-login/admin-login.component';
import { AdminRegisterComponent } from './modules/admin/components/admin-register/admin-register.component';
import { AdminRequestResetComponent } from './modules/admin/components/reset-password/admin-request-reset/admin-request-reset.component';
import { AdminResponseResetComponent } from './modules/admin/components/reset-password/admin-response-reset/admin-response-reset.component';
import { EmployeLoginComponent } from './modules/employe/components/employe-login/employe-login.component';
import { RequestResetComponent } from './modules/employe/components/reset/request-reset/request-reset.component';
import { ResponseResetComponent } from './modules/employe/components/reset/response-reset/response-reset.component';

const routes: Routes = [
  { path: '', redirectTo: 'employee/login', pathMatch: 'full' },

  { path: 'admin/login', component: AdminLoginComponent, data: { title: 'Admin Login - Younedia' } },

  { path: 'admin/register', component: AdminRegisterComponent, data: { title: 'Admin Register - Younedia' } },

  {
    path: 'admin/reset-password',
    component: AdminRequestResetComponent, data: { title: 'Reset Admin Password - Younedia' }
  },

  {
    path: 'admin/response-reset-password/:token',
    component: AdminResponseResetComponent, data: { title: 'Reset Admin Password - Younedia' }
  },
  
  { path: 'employee/login', component: EmployeLoginComponent, data: { title: 'Employee Login - Younedia' } },

  {
    path: 'employee/request-reset-password',
    component: RequestResetComponent, data: { title: 'Reset Employee Password - Younedia' }
  },
  {
    path: 'employee/response-reset-password/:token',
    component: ResponseResetComponent
  },
  { path: 'employee', loadChildren: () => import('./modules/employe/employe.module').then(m => m.EmployeModule),
  data: { title: 'Employee Management - Younedia' }},

  { path: 'admin', loadChildren: () => import('./modules/admin/admin.module').then(m => m.AdminModule),
  data: { title: 'Admin Panel - Employee Management - Younedia' }},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules, initialNavigation: 'enabledBlocking' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
