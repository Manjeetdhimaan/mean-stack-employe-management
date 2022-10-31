import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeLoginComponent } from './components/employe-login/employe-login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { EmployeProfileComponent } from './components/employe-profile/employe-profile.component';
import { EditProfileComponent } from './components/edit-profile/edit-profile.component';
import { HeaderComponent } from './components/header/header.component';

import { EmployeRoutingModule } from './employe-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';

import { DropdownModule } from "primeng/dropdown";
import { MultiSelectModule } from "primeng/multiselect";
import { MenubarModule } from 'primeng/menubar';
import { SidebarModule } from 'primeng/sidebar';
import { TableModule } from 'primeng/table';
import { InputSwitchModule } from 'primeng/inputswitch';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { LeavesComponent } from './components/leaves/leaves.component';
import { ApplyLeavesComponent } from './components/leaves/apply-leaves/apply-leaves.component';
import { AttendanceComponent } from './components/employe-profile/attendance/attendance.component';
import { TimelineComponent } from './components/employe-profile/timeline/timeline.component';
;
@NgModule({
  declarations: [
    EmployeLoginComponent,
    EmployeProfileComponent,
    EditProfileComponent,
    HeaderComponent,
    LeavesComponent,
    ApplyLeavesComponent,
    AttendanceComponent,
    TimelineComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    EmployeRoutingModule,
    HttpClientModule,
    MatFormFieldModule,
    DropdownModule,
    MultiSelectModule,
    MenubarModule,
    SidebarModule,
    MatTabsModule,
    MatToolbarModule,
    TableModule,
    InputSwitchModule,
    MatCardModule,
    SharedModule
  ],
  exports: [
  ]
})
export class EmployeModule { }
