import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DarkModeComponent } from './components/ui-components/dark-mode/dark-mode.component';

import {SidebarModule} from 'primeng/sidebar';
import {ButtonModule} from 'primeng/button';
import {MenubarModule} from 'primeng/menubar';
import { PayrollComponent } from './components/resUsuableComponents/payroll/payroll.component';

@NgModule({
  declarations: [
    DarkModeComponent,
    PayrollComponent,
  ],
  imports: [
    CommonModule,
    ButtonModule,
    SidebarModule,
    MenubarModule
  ],
  exports: [
    DarkModeComponent,
    PayrollComponent
  ]
})
export class SharedModule { }
