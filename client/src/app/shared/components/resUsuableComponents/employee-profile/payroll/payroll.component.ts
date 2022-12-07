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
   @Input() userDetails:any = {};
   indexOfRenderedItem: number= 0;
 
  ngOnInit(): void {
  }

  paginate(event:any) {
    this.indexOfRenderedItem = event.page;
    window.scroll({
      top: 0,
      behavior: 'smooth'
    })
    // event.first = Index of the first record
    // event.rows = Number of rows to display in new page
    // event.page = Index of the new page
    // event.pageCount = Total number of pages
}

}
