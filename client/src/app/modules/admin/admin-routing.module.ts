import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AdminAuthGuard } from 'src/app/shared/auth/admin-auth.guard';
import { PageNotFoundComponent } from 'src/app/shared/components/404/page-not-found/page-not-found.component';
import { AdminChangePasswordComponent } from './components/admin-change-password/admin-change-password.component';
import { AdminHeaderComponent } from './components/core/admin-header/admin-header.component';

import { EditAdminProfileComponent } from './components/edit-admin-profile/edit-admin-profile.component';
import { EmployeeLeavesComponent } from './components/employees-leaves/employee-leaves/employee-leaves.component';
import { EmployeesLeavesComponent } from './components/employees-leaves/employees-leaves.component';
import { EmployeeTimelineComponent } from './components/employees/employee-timeline/employee-timeline.component';
import { EmployeesComponent } from './components/employees/employees.component';
import { NotificationsComponent } from './components/notifications/notifications.component';

const routes: Routes = [

  {
    path: '', component: AdminHeaderComponent, canActivate: [AdminAuthGuard], children: [
      { path: '', redirectTo: 'employees', pathMatch: 'full' },
      {
        path: 'profile/edit',
        component: EditAdminProfileComponent, data: { title: 'Edit Admin Profile - ADMIN PANEL' }, canActivate: [AdminAuthGuard]
      },
      {
        path: 'employees', canActivate: [AdminAuthGuard], children: [
          {
            path: '', component: EmployeesComponent, data: { title: 'All Emloyees - ADMIN PANEL' }, canActivate: [AdminAuthGuard]
          },
          {
            path: 'leaves/check', component: EmployeesLeavesComponent, data: { title: 'All Employees Leaves - ADMIN PANEL' }, canActivate: [AdminAuthGuard]
          },
          {
            path: 'employee/:id', component: EmployeeTimelineComponent, data: { title: 'Employee Profile - ADMIN PANEL' }, canActivate: [AdminAuthGuard]
          },
          {
            path: 'leaves/check/:id', component: EmployeeLeavesComponent, data: { title: 'Check Employee Leaves - ADMIN PANEL' }, canActivate: [AdminAuthGuard]
          },
        ]
      },
      {
        path: 'settings', canActivate: [AdminAuthGuard], children: [
          {
            path: 'change-password', component: AdminChangePasswordComponent, data: { title: 'Change Admin password - ADMIN PANEL' }, canActivate: [AdminAuthGuard]
          },
          
        ]
      },
      {
        path: 'notifications',
        component: NotificationsComponent, data: { title: 'Notifications - ADMIN PANEL' }, canActivate: [AdminAuthGuard]
      },
      { path: '404', component: PageNotFoundComponent, data: { title: 'Page Not Found' }, canActivate: [AdminAuthGuard] },
      { path: '**', redirectTo: '404' }
    ],

  }
]
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }