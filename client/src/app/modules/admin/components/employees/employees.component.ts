import { animate, query, stagger, style, transition, trigger } from '@angular/animations';
import { NoopScrollStrategy } from '@angular/cdk/overlay';
import { Component, Inject, Injector, OnInit, HostBinding, ElementRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';

import { PopupModelComponent } from 'src/app/shared/components/ui-components/popup-model/popup-model.component';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';

import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-employees',
  styleUrls: ['./employees.component.scss'],
  animations: [
    trigger('pageAnimations', [
      transition(':enter', [
        query('.hero, form', [
          style({ opacity: 0, transform: 'translateY(-100px)' }),
          stagger(-15, [
            animate('500ms cubic-bezier(0.35, 0, 0.25, 1)', style({ opacity: 1, transform: 'none' }))
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
  ],
  template: `
      <div *ngIf="users?.length>=1">
      <div class="container" #modalBackground>
            <div class="row">
              <div #card class="col-lg-3 col-md-4 col-sm-6 col-xs-12" *ngFor="let user of users">
                <app-employee [cardBgImage]="user['imagePath']" [name]="user['fullName']" [designation]="user['service']" (checkEmitter)="onCheck($event, user['_id'])" (selectUserEmitter)="onNavigateToUserProfile(user)"></app-employee>
              </div>
            </div>
        </div>
        <p-paginator *ngIf="totalUsers>perPage" [rows]="10" [totalRecords]="totalUsers" [rowsPerPageOptions]="[4, 8, 16]" (onPageChange)="paginate($event)"></p-paginator>
      </div>
      <div  *ngIf="users?.length<=0 && !isLoading">No Users Found </div>
      <!-- <button type="button" (click)="checkAllUsers()"> Check in All</button> -->
    <ng-progress [thick]="true"></ng-progress>
`
})
export class EmployeesComponent implements OnInit {

  constructor(private adminService: AdminService, public dialog: MatDialog, private router: Router,
    @Inject(Injector) private readonly injector: Injector, private activatedRoute: ActivatedRoute) { }

  @ViewChild('modalBackground') modalBackground: ElementRef;

  private get toastMessageService() {
    return this.injector.get(ToasTMessageService);
  }

  @HostBinding('@pageAnimations')
  imgUrl: string = '';

  users: any;
  totalUsers: number;
  perPage: number = 8;
  currentPage: number;
  isLoading: boolean = false;

  ngOnInit(): void {
    this.isLoading = true;
    this.activatedRoute.queryParams
      .subscribe((params) => {
        if (params['page'] && params['page'] >= 1) {
          this.adminService.getUsers(+params['page'], this.perPage).subscribe(
            (res: any) => {
              this.isLoading = false;
              this.totalUsers = res['counts'];
              this.users = res['users'];
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
          this.adminService.getUsers(1, this.perPage).subscribe(
            (res: any) => {
              this.isLoading = false;
              this.totalUsers = res['counts'];
              this.users = res['users'];
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

  paginate(event: any) {
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
    this.adminService.getUsers(event.page + 1, event.rows).subscribe(
      (res: any) => {
        this.isLoading = false;
        this.totalUsers = res['counts'];
        this.users = res['users'];
        this.router.navigateByUrl(`admin/employees?page=${event.page + 1}`)
      },
      err => {
        this.isLoading = false;
        if (err.error.message === 'Admin not found') {
          this.router.navigate(['admin/login']);
        }
      }
    );

  }

  onCheck(event: string, id: string) {
    // checkIn
    if (event.toLowerCase() == 'checkin') {
      this.adminService.checkIn(id).subscribe((res: any) => {
        console.log(res);
        this.toastMessageService.success(res['message']);
      }, error => {
        this.toastMessageService.error(error.error.message);
      })
    }

    // checkOut
    if (event.toLowerCase() == 'checkout') {
      document.body.classList.add('noscroll');
      this.modalBackground.nativeElement.style.filter = 'blur(8px)';
      const dialogRef = this.dialog.open(PopupModelComponent, {
        width: '250px',
        data: ['Full day', 'Half Day'],
        scrollStrategy: new NoopScrollStrategy()
      });

      dialogRef.afterClosed().subscribe(result => {
        document.body.classList.remove('noscroll');
        this.modalBackground.nativeElement.style.filter = 'blur(0)';
        if (!result) {
          return;
        }
        this.adminService.checkOut(id, result).subscribe((res: any) => {
          this.toastMessageService.success(res['message']);
        }, error => {
          if (error.error.message) {

            this.toastMessageService.error(error.error.message);
          }
          else {
            this.toastMessageService.error(error.error);
          }
        })
      });

    }
  }

  onNavigateToUserProfile(user: any) {
    this.router.navigate([`/admin/employees/employee/${user['_id']}`]);
  }

  checkAllUsers() {
    const data = {
      entry: Date.now()
    }
    this.adminService.checkAllUsers(data).subscribe((res: any) => {
      this.toastMessageService.success(res['message']);
    }, error => {
      if (error.error.message) {
        this.toastMessageService.error(error.error.message);
      }
      else {
        this.toastMessageService.error(error.error);
      }
    })
  }


  // getPostionFromTop() {
  //   const body = document.body
  //   const {
  //     top: t,
  //     left: l
  //   } = body.getBoundingClientRect();
  //   const {
  //     scrollX,
  //     scrollY
  //   } = window
  //   const topPos = t + scrollX
  //   const leftPos = l + scrollY
  //   return topPos;
  // }
}
