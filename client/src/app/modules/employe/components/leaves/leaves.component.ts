import { Component, Input, OnInit } from '@angular/core';
import { fade, slideUp } from 'src/app/shared/common/animations/animations';
import { FormatTimeService } from 'src/app/shared/services/time-utils/formatTime.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-leaves',
  templateUrl: './leaves.component.html',
  styleUrls: ['./leaves.component.scss'],
  animations: [
    fade,
    slideUp
  ]
})
export class LeavesComponent implements OnInit {

  constructor(public formatTimeService: FormatTimeService, private userService: UserService) { }
  leaves: any[] = [];
  userDetails: any = {};

  globalFilterColumn = [
    'from',
    'to',
    'reason',
    'status'
  ];

  columns = [
    { header: 'From', field: 'from', fieldName: 'from' },
    { header: 'To', field: 'to', fieldName: 'to' },
    { header: 'Reason', field: 'reason', fieldName: 'reason' },
    { header: 'Status', field: 'status', fieldName: 'status' }
  ];

  _selectedColumns: any[] = this.columns;

  @Input() get selectedColumns(): any[] {
    return this._selectedColumns;
  }

  set selectedColumns(val: any[]) {
    //restore original order
    this._selectedColumns = this.columns.filter((col) => val.includes(col));
  }

  ngOnInit(): void {
    this.userService.getUserProfile().subscribe(
      (res: any) => {
        this.userDetails = res['user'];
        this.leaves = this.userDetails.leaves.reverse();


        // this.firstName = this.userDetails['fullname'].toString().split(" ")[0].trim();
        // const lastNameArray = this.userDetails['fullname'].toString().split(" ").slice(1);
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

  createTrigger() {

  }

  getCustomCss(status: any) {
    //Logic here;
    if (status == "Approved") {
      return 'success'
    }
    if (status == "Denied") {
      return 'danger'
    }
    return 'warn'
  }

}
