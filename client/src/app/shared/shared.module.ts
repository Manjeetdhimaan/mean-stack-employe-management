import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';

import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { MenubarModule } from 'primeng/menubar';
import { TableModule } from 'primeng/table';
import { MultiSelectModule } from 'primeng/multiselect';
import {PaginatorModule} from 'primeng/paginator';


import { DarkModeComponent } from './components/ui-components/dark-mode/dark-mode.component';
import { PayrollReusalbleComponent } from './components/resUsuableComponents/employee-profile/payroll/payroll.component';
import { EmployeeComponent } from './components/resUsuableComponents/employee/employee.component';
import { PopupModelComponent } from './components/ui-components/popup-model/popup-model.component';
import { EmployeeReusalbleProfileComponent } from './components/resUsuableComponents/employee-profile/employee-profile.component';
import { AttendanceReusalbleComponent } from './components/resUsuableComponents/employee-profile/attendance/attendance.component';
import { TimelineReusalbleComponent } from './components/resUsuableComponents/employee-profile/timeline/timeline.component';
import { PageNotFoundComponent } from './components/404/page-not-found/page-not-found.component';
import { CheckLeavesComponent } from './components/resUsuableComponents/check-leaves/check-leaves.component';
import { ChangePasswordFormComponent } from './components/resUsuableComponents/change-password-form/change-password-form.component';
import { NgProgressModule } from 'ngx-progressbar';
import { NgProgressHttpModule } from "ngx-progressbar/http";
import { CreatePayrollComponent } from './components/resUsuableComponents/employee-profile/create-payroll/create-payroll.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import{ MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { DiscardChangesComponent } from './components/ui-components/discard-changes/discard-changes.component';

@NgModule({
  declarations: [
    DarkModeComponent,
    PayrollReusalbleComponent,
    EmployeeComponent,
    PopupModelComponent,
    EmployeeReusalbleProfileComponent,
    AttendanceReusalbleComponent,
    TimelineReusalbleComponent,
    PageNotFoundComponent,
    CheckLeavesComponent,
    ChangePasswordFormComponent,
    CreatePayrollComponent,
    DiscardChangesComponent,
  ],
  imports: [
    CommonModule,
    ButtonModule,
    SidebarModule,
    MenubarModule,
    MatInputModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatRadioModule,
    MatListModule,
    MatCardModule,
    TableModule,
    MultiSelectModule,
    MatTabsModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FormsModule,
    ReactiveFormsModule,
    PaginatorModule,
    NgProgressModule.withConfig({
      color: "green"
    }),
    NgProgressHttpModule
  ],
  exports: [
    DarkModeComponent,
    PayrollReusalbleComponent,
    EmployeeComponent,
    EmployeeReusalbleProfileComponent,
    CheckLeavesComponent,
    ChangePasswordFormComponent
  ]
})
export class SharedModule { }
