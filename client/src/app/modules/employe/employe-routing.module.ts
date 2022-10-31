import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/shared/auth/auth.guard';
import { EditProfileComponent } from './components/edit-profile/edit-profile.component';
import { EmployeLoginComponent } from './components/employe-login/employe-login.component';
import { EmployeProfileComponent } from './components/employe-profile/employe-profile.component';

const routes: Routes = [
  {
    path: '',
    component: EmployeLoginComponent, data: {title: 'Employe Login - Younedia'}, pathMatch: 'full'
  },
  {
    path: 'profile',
    component: EmployeProfileComponent, data: {title: 'Employe Profile - Younedia'}, canActivate:[AuthGuard]
  },
  {
    path: 'edit-profile',
    component: EditProfileComponent, data: {title: 'Edit Profile - Younedia'}, canActivate:[AuthGuard]
  },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeRoutingModule {}