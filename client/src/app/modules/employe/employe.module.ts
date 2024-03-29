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
import { MatGridListModule } from '@angular/material/grid-list';
import { EmployeeChangePasswordComponent } from './components/employee-change-password/employee-change-password.component';
import { NgProgressModule } from 'ngx-progressbar';
import { NgProgressHttpModule } from 'ngx-progressbar/http';
import { ImageCropperModule } from 'ngx-image-cropper';
import {DialogModule} from 'primeng/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { CalendarModule } from 'primeng/calendar';
import { RequestResetComponent } from './components/reset/request-reset/request-reset.component';
import { ResponseResetComponent } from './components/reset/response-reset/response-reset.component';
;
@NgModule({
  declarations: [
    EmployeProfileComponent,
    EditProfileComponent,
    HeaderComponent,
    LeavesComponent,
    ApplyLeavesComponent,
    EmployeeChangePasswordComponent,
    RequestResetComponent,
    ResponseResetComponent
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
    MatMenuModule,
    ImageCropperModule,
    DialogModule,
    MatGridListModule,
    MatDatepickerModule,
    CalendarModule,
    NgProgressModule.withConfig({
      color: "yellow"
    }),
    NgProgressHttpModule
  ],
  exports: [
  ]
})
export class EmployeModule { }
