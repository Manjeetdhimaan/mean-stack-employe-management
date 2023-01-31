
import { animate, query, stagger, style, transition, trigger } from '@angular/animations';
import { Component, ElementRef, HostBinding, Inject, Injector, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { AdminNotificationsService } from '../../services/admin-notifications.service';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
  animations: [
    trigger('pageAnimations', [
      transition(':enter', [
        query('.hero, form', [
          style({ opacity: 0, transform: 'translateY(-100px)' }),
          stagger(-25, [
            animate('1500ms cubic-bezier(0.35, 3, 0.25, 1)', style({ opacity: 1, transform: 'none' }))
          ])
        ], { optional: true })
      ])
    ]),
    trigger('filterAnimation', [
      transition(':enter, * => 0, * => -1', []),
      transition(':increment', [
        query(':enter', [
          style({ opacity: 0, width: '0px' }),
          stagger(50, [
            animate('500ms ease-out', style({ opacity: 1, width: '*' })),
          ]),
        ], { optional: true })
      ]),
      transition(':decrement', [
        query(':leave', [
          stagger(50, [
            animate('500ms ease-out', style({ opacity: 0, width: '0px' })),
          ]),
        ])
      ]),
    ]),
  ]
})
export class NotificationsComponent implements OnInit {
  constructor(private adminService: AdminService, public dialog: MatDialog, private router: Router,
    @Inject(Injector) private readonly injector: Injector, private activatedRoute: ActivatedRoute, private adminNotificationsService: AdminNotificationsService) { }

  @ViewChild('modalBackground') modalBackground: ElementRef;

  private get toastMessageService() {
    return this.injector.get(ToasTMessageService);
  }

  // @HostBinding('@pageAnimations')
  public animatePage = true;
  heroTotal = -1;


  notifications: any = [];
  totalNotifications: number;
  unReadNotification: number = 0;
  perPage: number = 12;
  currentPage: number;
  isLoading: boolean = false;
  userImageUrl: any =
    'assets/img/profileDefault.png';

  ngOnInit() {
    this.unReadNotification = 0;
    this.isLoading = true;
    // this.adminNotificationsService.fetchNotifications().subscribe((res: any) => {
    //   console.log(res);
    //   this.notifications = res['notifications'];
    //   this.totalNotifications = res['counts'];
    // });
    // console.log(this.adminNotificationsService.getNotifications())
    // this.totalNotifications = this.adminNotificationsService.totalNotifications;
    this.adminService.markAsReadAllNotifications(null).subscribe(res => console.log(res))

    this.activatedRoute.queryParams
      .subscribe((params) => {
        if (params['page'] && params['page'] >= 1) {
          this.adminNotificationsService.fetchNotifications(+params['page'], this.perPage).subscribe((res: any) => {
            this.isLoading = false;
            this.notifications = res['notifications'];
            this.totalNotifications = res['counts'];
            this.notifications.map((notification: any) => {
              if (notification.isRead === false) {
                this.unReadNotification++
              }
            })
            this.adminService.notifications.next(this.unReadNotification);
          },
          err => {
            this.isLoading = false;
            if (err.error.message === 'Admin not found') {
              this.router.navigate(['admin/login']);
            }
          }
        );
 
        }
        else {
          this.adminNotificationsService.fetchNotifications(1, this.perPage).subscribe(
            (res: any) => {
              this.isLoading = false;
              this.totalNotifications = res['counts'];
              this.notifications = res['notifications'];
              this.notifications.map((notification: any) => {
                if (notification.isRead === false) {
                  this.unReadNotification++
                }
              })
              this.adminService.notifications.next(this.unReadNotification);
            },
            err => {
              this.isLoading = false;
              if (err.error.message === 'Admin not found') {
                this.router.navigate(['admin/login']);
              }
            }
          );
        }

      });
  }

  pictNotLoading(event: any) { event.target.src = 'assets/img/profileDefault.png'; }

  paginate(event: any) {
    this.unReadNotification = 0;
    this.isLoading = true;
    event.first = 2
    // event.rows = Number of rows to display in new page
    // event.page = Index of the new page
    // event.pageCount = Total number of pages
    // this.indexOfRenderedItem = event.page;
    window.scroll({
      top: 0,
      behavior: 'smooth'
    })
    this.perPage = event.rows
    this.adminService.getNotifications(event.page + 1, event.rows).subscribe(
      (res: any) => {
        this.isLoading = false;
        this.totalNotifications = res['counts'];
        this.notifications = res['notifications'];
        this.notifications.map((notification: any) => {
          if (notification.isRead === false) {
            this.unReadNotification++
          }
        })
        this.adminService.notifications.next(this.unReadNotification);
        this.router.navigateByUrl(`admin/notifications?page=${event.page + 1}`);
      },
      err => {
        this.isLoading = false;
        if (err.error.message === 'Admin not found') {
          this.router.navigate(['admin/login']);
        }
      }
    );
  }

}
