import { Component, Input, OnInit } from '@angular/core';
import { UserService } from 'src/app/modules/employe/services/user.service';

@Component({
  selector: 'app-reusable-payroll',
  templateUrl: './payroll.component.html',
  styleUrls: ['./payroll.component.scss']
})
export class PayrollReusalbleComponent implements OnInit {

  constructor(private userService: UserService) { }
   @Input() payroll:any= [];
   @Input() user:any = {};
 
  ngOnInit(): void {

 
  }

}
