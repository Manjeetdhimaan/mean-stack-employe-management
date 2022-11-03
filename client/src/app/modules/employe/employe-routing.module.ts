import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/shared/auth/auth.guard';
import { EditProfileComponent } from './components/edit-profile/edit-profile.component';
import { EmployeProfileComponent } from './components/employe-profile/employe-profile.component';
import { HeaderComponent } from './components/header/header.component';
import { ApplyLeavesComponent } from './components/leaves/apply-leaves/apply-leaves.component';
import { LeavesComponent } from './components/leaves/leaves.component';

const routes: Routes = [
  {
    path: '', component: HeaderComponent, children: [
      { path: '', redirectTo: 'profile', pathMatch: 'full' },
      {
        path: 'profile',
        component: EmployeProfileComponent, data: { title: 'Employe Profile - Younedia' }, canActivate: [AuthGuard]
      },
      {
        path: 'edit-profile',
        component: EditProfileComponent, data: { title: 'Edit Profile - Younedia' }, canActivate: [AuthGuard]
      },
      {
        path: 'leaves', canActivate: [AuthGuard], children: [
          {
            path: 'check' , component: LeavesComponent, data: { title: 'Check leaves - Younedia' }, canActivate: [AuthGuard]
          },
          {
            path: 'apply',
            component: ApplyLeavesComponent, data: { title: 'Apply leaves - Younedia' }, canActivate: [AuthGuard]
          }
        ],
      }
    ]
  }



];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeRoutingModule { }