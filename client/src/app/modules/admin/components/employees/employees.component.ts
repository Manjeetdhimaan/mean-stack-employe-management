import { animate, query, stagger, style, transition, trigger } from '@angular/animations';
import { NoopScrollStrategy } from '@angular/cdk/overlay';
import { Component, Inject, Injector, OnInit, HostBinding, ElementRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

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
          style({opacity: 0, transform: 'translateY(-100px)'}),
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
        <div class="container" #modalBackground>
            <div class="row">
              <div #card class="col-lg-3 col-md-4 col-sm-6 col-xs-12" *ngFor="let user of users">
                <app-employee [cardBgImage]="user['imgUrl']" [name]="user['fullName']" [designation]="user['service']" (checkEmitter)="onCheck($event, user['_id'])" (selectUserEmitter)="onNavigateToUserProfile(user)"></app-employee>
              </div>
            </div>
        </div>
<ng-progress [thick]="true"></ng-progress>
`
})
export class EmployeesComponent implements OnInit {

  constructor(private adminService: AdminService, public dialog: MatDialog, private router: Router, 
    @Inject(Injector) private readonly injector: Injector) { }

    @ViewChild('modalBackground') modalBackground: ElementRef;

    private get toastMessageService() {
      return this.injector.get(ToasTMessageService);
  }

  @HostBinding('@pageAnimations')
  imgUrl: string = ''

  users: any;

  ngOnInit(): void {

    this.adminService.getUsers().subscribe(
      (res: any) => {
        this.users = res['users'];
        // this.attendance = this.userDetails.attendance.reverse();
        // this.firstName = this.userDetails['fullName'].toString().split(" ")[0].trim();
        // const lastNameArray = this.userDetails['fullName'].toString().split(" ").slice(1);
        // this.lastName = '';
        // lastNameArray.map((n:string, i:number) => {
        //   this.lastName += (n)+' '
        // })
      },
      err => {
        console.log(err);
        if(err.error.message === 'Admin not found'){
          this.router.navigate(['admin/login']);
        }
      }
    );
  }

  onCheck(event: string, id: string) {
    // checkIn
    if (event.toLowerCase() == 'checkin') {
      this.adminService.checkIn(id).subscribe((res:any) => {
        console.log(res);
        this.toastMessageService.success(res['message']);
      }, error => {
        console.log("error", error);
        this.toastMessageService.info(error.error.message);
      })
    }

    // checkOut
    if (event.toLowerCase() == 'checkout') {
      document.body.style.overflow = 'hidden';
      this.modalBackground.nativeElement.style.filter = 'blur(8px)';
      const dialogRef = this.dialog.open(PopupModelComponent, {
        width: '250px',
        data: ['Full day', 'Half Day'],
        scrollStrategy: new NoopScrollStrategy()
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log(result)
        document.body.style.overflow = 'auto';
        this.modalBackground.nativeElement.style.filter = 'blur(0)';
        if (!result) {
          return;
        }
        this.adminService.checkOut(id, result).subscribe((res:any) => {
          console.log(res);
          this.toastMessageService.success(res['message']);
        }, error => {
          console.log("error", error);
          this.toastMessageService.error(error.error.message);
        })
      });

    }
  }

  onNavigateToUserProfile(user: any) {
    this.router.navigate([`/admin/employees/employee/${user['_id']}`]);
  }

  onRespondToLeaves() {
    let credentials = {
      id: "this.userDetails['_id']",
      event: 'Approved',
      prevStatus: 'Approved'
    }

    this.adminService.respondToLeaves("this.userDetails['_id']", credentials).subscribe(
      (res: any) => {
        console.log(res)
      },
      err => {
        console.log(err);
      }
    );
  }
}
