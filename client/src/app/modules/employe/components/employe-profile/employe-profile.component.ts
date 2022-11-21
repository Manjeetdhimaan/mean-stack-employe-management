import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-employe-profile',
  styleUrls: ['./employe-profile.component.scss'],
  template: `
      <app-reusable-employee-profile
            [userDetails]="userDetails"
            [firstName]="firstName" 
            [lastName]="lastName" 
            [profileImageUrl]="profileImageUrl" 
            [attendance]="attendance" 
            [payroll]="payroll"
            >
      </app-reusable-employee-profile>
  `
})
export class EmployeProfileComponent implements OnInit {

  constructor(private userService: UserService) { }

  userDetails: any = {};
  firstName: string = '';
  lastName: string = '';
  profileImageUrl: string =
    'https://g99plus.b-cdn.net/AEMR/assets/img/profileDefault.png';

  attendance: any[];
  payroll: any[];

  ngOnInit(): void {
    this.userService.getUserProfile().subscribe(
      (res: any) => {
        this.userDetails = res['user'];
        this.payroll = this.userDetails.payroll.sort((a: any, b: any) => a.month.slice(0, 4) - b.month.slice(0, 4)).reverse();
        this.profileImageUrl = this.userDetails['imgUrl']
        this.attendance = this.userDetails.attendance.reverse();
        this.firstName = this.userDetails['fullName'].toString().split(" ")[0].trim();
        const lastNameArray = this.userDetails['fullName'].toString().split(" ").slice(1);
        this.lastName = '';
        lastNameArray.map((n: string, i: number) => {
          this.lastName += (n) + ' '
        });
      },
      err => {
        console.log(err);
      }
    );
  }
}
