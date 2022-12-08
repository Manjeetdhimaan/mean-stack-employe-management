import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './shared/shared.module';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './shared/auth/auth.interceptor';
import { AdminLoginComponent } from './modules/admin/components/admin-login/admin-login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EmployeLoginComponent } from './modules/employe/components/employe-login/employe-login.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ToastrModule } from 'ngx-toastr';
import { NgProgressModule } from 'ngx-progressbar';
import { NgProgressHttpModule } from "ngx-progressbar/http";


@NgModule({
  declarations: [
    AppComponent,
    AdminLoginComponent,
    EmployeLoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatToolbarModule,
    ToastrModule.forRoot({
      positionClass :'toast-top-right'
    }),
    NgProgressModule.withConfig({
      color: "violet"
    }),
    NgProgressHttpModule
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
