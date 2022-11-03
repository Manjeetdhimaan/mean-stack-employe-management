import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { UserService } from 'src/app/modules/employe/services/user.service';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/modules/admin/services/admin.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private userService : UserService, private router : Router, private adminService : AdminService){}

  intercept(req: HttpRequest<any>, next: HttpHandler) {

      if (req.headers.get('noauth'))
          return next.handle(req.clone());
      else {
          let clonedreq;
              if (this.adminService.isAdmin === false) {
                   clonedreq = req.clone({
                      headers: req.headers.set("Authorization", "Bearer " + this.userService.getToken())
                  });
              }
              else {
                  clonedreq = req.clone({
                      headers: req.headers.set("Authorization", "Bearer " + this.adminService.getToken())
                  });
              }
          
          return next.handle(clonedreq).pipe(
              tap(
                  event => { },
                  err => {
                      if (err.error.auth == false && this.adminService.isAdmin === false) {
                          this.router.navigateByUrl('/employee/login');
                      }
                      else if (err.error.auth == false &&  this.adminService.isAdmin === true) {
                          this.router.navigateByUrl('/admin/login');
                      }
                  })
          );
      }
  }
}
