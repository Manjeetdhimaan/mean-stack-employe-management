import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from "@angular/common/http";
import { environment } from 'src/environments/environment';
import { AdminService } from './admin.service';

@Injectable({
  providedIn: 'root'
})
export class AdminNotificationsService {

  notifications: any;
  totalNotifications: number;
  unReadNotification: number = 0;
  perPage: number = 100;
  currentPage: number;
  isLoading: boolean = false;

  constructor(private http: HttpClient) { 
      // this.activatedRoute.queryParams
      // .subscribe((params) => {
      //   if (params['page'] && params['page'] >= 1) {
      //     this.adminService.getNotifications(+params['page'], this.perPage).subscribe(
      //       (res: any) => {
      //         this.isLoading = false;
      //         this.totalNotifications = res['counts'];
      //         this.notifications = res['notifications'];
      //         this.notifications.map((notification: any) => {
      //           if (notification.isRead === false) {
      //             this.unReadNotification++
      //           }
      //         })

      //         this.adminService.notifications.next(this.unReadNotification);
      //       },
      //       err => {
      //         this.isLoading = false;
      //         if (err.error.message === 'Admin not found') {
      //           this.router.navigate(['admin/login']);
      //         }
      //       }
      //     );
      //   }
      //   else {
      //     this.adminService.getNotifications(1, this.perPage).subscribe(
      //       (res: any) => {
      //         this.isLoading = false;
      //         this.totalNotifications = res['counts'];
      //         this.notifications = res['notifications'];
      //         this.notifications.map((notification: any) => {
      //           if (notification.isRead === false) {
      //             this.unReadNotification++
      //           }
      //         })
      //         this.adminService.notifications.next(this.unReadNotification);
      //       },
      //       err => {
      //         this.isLoading = false;
      //         if (err.error.message === 'Admin not found') {
      //           this.router.navigate(['admin/login']);
      //         }
      //       }
      //     );
      //   }

      // });
    
   }

   fetchNotifications (page:number, perPage: number) {
    return this.http.get(environment.apiBaseUrl + `/admin/notifications/${page}/${perPage}`);
   }

  async getNotifications () {
     return await this.notifications.slice();
   }
}
