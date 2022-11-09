import { NoopScrollStrategy } from '@angular/cdk/overlay';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { PopupModelComponent } from 'src/app/shared/components/ui-components/popup-model/popup-model.component';

import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-employees',
  styleUrls: ['./employees.component.scss'],
  template: `
        <div class="container">
            <div class="row">
              <div #card class="col-lg-3 col-md-4 col-sm-6 col-xs-12" *ngFor="let user of users">
                <app-employee [cardBgImage]="user['imgUrl']" [name]="user['fullName']" [designation]="user['service']" (checkEmitter)="onCheck($event, user['_id'])" (selectUserEmitter)="onNavigateToUserProfile(user)"></app-employee>
              </div>
            </div>
        </div>
`
})
export class EmployeesComponent implements OnInit {

  constructor(private adminService: AdminService, public dialog: MatDialog, private router: Router) { }

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
      }
    );
  }

  onCheck(event: string, id: string) {
    // checkIn
    if (event.toLowerCase() == 'checkin') {
      this.adminService.checkIn(id).subscribe((res) => {
        console.log(res)
      }, error => {
        console.log("error", error)
      })
    }

    // checkOut
    if (event.toLowerCase() == 'checkout') {
      document.body.style.overflow = 'hidden';
      const dialogRef = this.dialog.open(PopupModelComponent, {
        width: '250px',
        data: ['Full day', 'Half Day'],
        scrollStrategy: new NoopScrollStrategy()
      });

      dialogRef.afterClosed().subscribe(result => {
        document.body.style.overflow = 'auto';
        if (!result) {
          return;
        }
        this.adminService.checkOut(id, result).subscribe((res) => {
          console.log(res)
        }, error => {
          console.log("error", error)
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
