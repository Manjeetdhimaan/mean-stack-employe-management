import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminLoginComponent } from './modules/admin/components/admin-login/admin-login.component';
import { EmployeLoginComponent } from './modules/employe/components/employe-login/employe-login.component';

const routes: Routes = [
  { path: '', redirectTo: 'employee/login', pathMatch: 'full' },

  { path: 'admin/login', component: AdminLoginComponent },

  { path: 'employee/login', component: EmployeLoginComponent },

  { path: 'employee', loadChildren: () => import('./modules/employe/employe.module').then(m => m.EmployeModule),
  data: { title: 'Employe Management - Younedia' }},

  { path: 'admin', loadChildren: () => import('./modules/admin/admin.module').then(m => m.AdminModule),
  data: { title: 'Employe Management - Younedia' }},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
