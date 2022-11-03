import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AdminAuthGuard } from 'src/app/shared/auth/admin-auth.guard';
import { AdminHeaderComponent } from './components/admin-header/admin-header.component';

import { AdminLoginComponent } from './components/admin-login/admin-login.component';
import { EditAdminProfileComponent } from './components/edit-admin-profile/edit-admin-profile.component';
import { EmployeeTimelineComponent } from './components/employees/employee-timeline/employee-timeline.component';
import { EmployeesComponent } from './components/employees/employees.component';

const routes: Routes = [

    {
        path: '', component: AdminHeaderComponent, canActivate:[AdminAuthGuard], children: [
            { path: '', redirectTo: 'employees', pathMatch: 'full' },
              {
                path: 'profile/edit',
                component: EditAdminProfileComponent, data: {title: 'Edit Admin Profile - Younedia'}, canActivate:[AdminAuthGuard]
              },
              {
                path: 'employees', canActivate:[AdminAuthGuard], children: [
                  {
                    path: '' , component: EmployeesComponent, data: { title: 'All Emloyees - Younedia' }, canActivate: [AdminAuthGuard]
                  },
                  {
                    path: 'employee/profile/:id' , component: EmployeeTimelineComponent, data: { title: 'Employee Profile - Younedia' }, canActivate: [AdminAuthGuard]
                  },
                ]
              },
        ]
      }
  
 
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {}