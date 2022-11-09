import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AdminService } from '../../../services/admin.service';

@Component({
  selector: 'app-employee-timeline',
  templateUrl: './employee-timeline.component.html',
  styleUrls: ['./employee-timeline.component.scss']
})
export class EmployeeTimelineComponent implements OnInit {

  constructor(private adminService: AdminService, private activatedRoute: ActivatedRoute) { }

  userDetails: any = {};
  firstName: string = '';
  lastName: string = '';
  profileImageUrl: any =
    'https://g99plus.b-cdn.net/AEMR/assets/img/profileDefault.png';

  attendance: any[];
  id: string;
  payroll: any[];

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.id = params['id'];
    });

    this.adminService.getUser(this.id).subscribe(
      (res: any) => {
        this.userDetails = res['user'];
        this.payroll = this.userDetails.payroll.sort((a:any,b:any)=> a.month.slice(0,4)-b.month.slice(0,4)).reverse();
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
