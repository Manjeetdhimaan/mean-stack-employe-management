import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { EmployeProfileComponent } from './components/employe-profile/employe-profile.component';
import { EditProfileComponent } from './components/edit-profile/edit-profile.component';
import { HeaderComponent } from './components/core/header/header.component';
import { LeavesComponent } from './components/leaves/leaves.component';
import { ApplyLeavesComponent } from './components/leaves/apply-leaves/apply-leaves.component';

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
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatMenuModule } from '@angular/material/menu';
import { EmployeeChangePasswordComponent } from './components/employee-change-password/employee-change-password.component';

;
@NgModule({
  declarations: [
    EmployeProfileComponent,
    EditProfileComponent,
    HeaderComponent,
    LeavesComponent,
    ApplyLeavesComponent,
    EmployeeChangePasswordComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    EmployeRoutingModule,
    HttpClientModule,
    MatFormFieldModule,
    DropdownModule,
    MultiSelectModule, //
    MenubarModule,
    SidebarModule,
    MatTabsModule,
    MatToolbarModule,
    TableModule, //
    InputSwitchModule,
    SharedModule,
    MatIconModule,
    MatListModule,
    MatButtonModule,
    MatSidenavModule,
    MatMenuModule
  ],
  exports: [
  ]
})
export class EmployeModule { }
