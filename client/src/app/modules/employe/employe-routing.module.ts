import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/shared/auth/auth.guard';
import { PageNotFoundComponent } from 'src/app/shared/components/404/page-not-found/page-not-found.component';
import { EditProfileComponent } from './components/edit-profile/edit-profile.component';
import { EmployeProfileComponent } from './components/employe-profile/employe-profile.component';
import { EmployeeChangePasswordComponent } from './components/employee-change-password/employee-change-password.component';
import { HeaderComponent } from './components/core/header/header.component';
import { ApplyLeavesComponent } from './components/leaves/apply-leaves/apply-leaves.component';
import { LeavesComponent } from './components/leaves/leaves.component';
import { RequestResetComponent } from './components/request-reset/request-reset.component';

const routes: Routes = [
  {
    path: '', component: HeaderComponent, children: [
      { path: '', redirectTo: 'profile', pathMatch: 'full' },
      {
        path: 'profile', canActivate: [AuthGuard], children: [
          {
            path: '', component: EmployeProfileComponent, data: { title: 'Employe Profile - Younedia' }, canActivate: [AuthGuard]
          },
          {
            path: 'edit',
            component: EditProfileComponent, data: { title: 'Edit Profile - Younedia' }, canActivate: [AuthGuard]
          }
        ],
      },
      {
        path: 'settings', canActivate: [AuthGuard], children: [
          {
            path: 'change-password', component: EmployeeChangePasswordComponent, data: { title: 'Change Employee Password - Younedia' }, canActivate: [AuthGuard]
          }
        ],
      },
     
      {
        path: 'leaves', canActivate: [AuthGuard], children: [
          {
            path: 'check', component: LeavesComponent, data: { title: 'Check leaves - Younedia' }, canActivate: [AuthGuard]
          },
          {
            path: 'apply',
            component: ApplyLeavesComponent, data: { title: 'Apply leaves - Younedia' }, canActivate: [AuthGuard]
          }
        ],
      },
          { path: '404', component: PageNotFoundComponent, data: { title: 'Page Not Found - Younedia' }, canActivate: [AuthGuard] },
          { path: '**', redirectTo: '404' }
    ]
  }



];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeRoutingModule { }