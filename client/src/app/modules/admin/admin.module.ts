import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from 'src/app/shared/shared.module';
import { AdminRoutingModule } from './admin-routing.module';

import { EditAdminProfileComponent } from './components/edit-admin-profile/edit-admin-profile.component';
import { EmployeesComponent } from './components/employees/employees.component';
import { AdminHeaderComponent } from './components/admin-header/admin-header.component';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { EmployeeTimelineComponent } from './components/employees/employee-timeline/employee-timeline.component';


@NgModule({
  declarations: [
    EditAdminProfileComponent,
    EmployeesComponent,
    AdminHeaderComponent,
    EmployeeTimelineComponent
  ],
  imports: [
    CommonModule,
    MatToolbarModule,
    FormsModule,
    ReactiveFormsModule,
    AdminRoutingModule,
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatButtonModule,
    SharedModule,
    MatInputModule
  ],
  exports: [

  ]
})
export class AdminModule { }
