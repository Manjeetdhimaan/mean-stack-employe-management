import { Component, Input, OnInit } from '@angular/core';
import { fade, slideUp } from 'src/app/shared/common/animations/animations';

@Component({
  selector: 'app-reusable-employee-profile',
  templateUrl: './employee-profile.component.html',
  styleUrls: ['./employee-profile.component.scss'],
  animations: [
    fade,
    slideUp
  ]
})
export class EmployeeReusalbleProfileComponent implements OnInit {

  constructor() { }

  @Input() userDetails:any={};
  @Input() firstName:string='';
  @Input() lastName:string='';
  @Input() profileImageUrl: any =
    'https://g99plus.b-cdn.net/AEMR/assets/img/profileDefault.png';

  @Input() attendance:any[];
  @Input() payroll:any[];
  @Input() user:any[];

  ngOnInit(): void {
  }

}
