import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';

const MONTHS = {
  0: "Jan",
  1: "Feb",
  2: "Mar",
  3: "Apr",
  4: "May",
  5: "Jun",
  6: "Jul",
  7: "Aug",
  8: "Sep",
  9: "Oct",
  10: "Nov",
  11: "Dec",
}

@Component({
  selector: 'app-employe-profile',
  styleUrls: ['./employe-profile.component.scss'],
  template: `
      <app-reusable-employee-profile
            [userDetails]="userDetails"
            [profileImageUrl]="profileImageUrl" 
            [attendance]="attendance" 
            [payroll]="payroll"
            >
      </app-reusable-employee-profile>
      <ng-progress [thick]="true"></ng-progress>
  `
})
export class EmployeProfileComponent implements OnInit {

  constructor(private userService: UserService) { }

  userDetails: any = {};
  profileImageUrl: string =
    'https://g99plus.b-cdn.net/AEMR/assets/img/profileDefault.png';

  attendance: any[];
  payroll: any[];

  ngOnInit(): void {
    this.userService.getUserProfile().subscribe(
      (res: any) => {
        this.userDetails = res['user'];
        this.userService.currentUserImgUrl.next({name: this.userDetails['fullName'], imagePath: this.userDetails['imagePath']});
        this.payroll = this.userDetails.payroll.slice().sort((a: any, b: any) => a.month?.slice(0, 4) - b.month?.slice(0, 4)).reverse();
        this.profileImageUrl = this.userDetails['imagePath']
        this.attendance = this.userDetails.attendance.slice().reverse();
       

        const d = new Date(this.userDetails?.joindate);
        Object.entries(MONTHS).forEach(
          ([key, value]) => {
            if (+key == +d.getMonth()) {
              const date = d.getDate();
              const month = value;
              const year = d.getFullYear();
              this.userDetails.joindate = `${month} ${date} ${year}`
            }
          }
        );
      },
      err => {
        console.log(err);
        if(err.error.message=== 'User record not found.') {
          this.userService.redirectToLogin();
        }
      }
    );

  
  
  }
}
