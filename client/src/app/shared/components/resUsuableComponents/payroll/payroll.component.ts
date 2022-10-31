import { Component, Input, OnInit } from '@angular/core';
import { UserService } from 'src/app/modules/employe/services/user.service';

@Component({
  selector: 'app-payroll',
  templateUrl: './payroll.component.html',
  styleUrls: ['./payroll.component.scss']
})
export class PayrollComponent implements OnInit {

  constructor(private userService: UserService) { }
   payroll:any= [];
   user:any = {};
 
  ngOnInit(): void {

    this.userService.getUserProfile().subscribe(
      (res:any) => {
        this.user = res['user'];
        this.payroll = this.user.payroll.sort((a:any,b:any)=> a.month.slice(0,4)-b.month.slice(0,4)).reverse();
      },
      err => {
        console.log(err);
      }
    );
  }

}
