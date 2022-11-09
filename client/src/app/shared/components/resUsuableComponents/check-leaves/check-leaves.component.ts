import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormatTimeService } from 'src/app/shared/services/time-utils/formatTime.service';

@Component({
  selector: 'app-check-leaves',
  templateUrl: './check-leaves.component.html',
  styleUrls: ['./check-leaves.component.scss']
})
export class CheckLeavesComponent implements OnInit {

  constructor(public formatTimeService: FormatTimeService) { }
  @Input() leaves: any[] = [];
  @Input() userDetails: any = {};
  @Input() isAdmin: boolean = false;

  @Output() respondToLeaves: EventEmitter<any> = new EventEmitter();
  // @Output() rejectLeaves: EventEmitter<any> = new EventEmitter();

  onRespondToLeaves(selectedLeave: string, leaveStatus:string) {
    this.respondToLeaves.emit({selectedLeave, leaveStatus})
  }

  // onRejectToLeaves(selectedLeave: string, leaveStatus:string) {
  //   this.rejectLeaves.emit({selectedLeave, leaveStatus})
  // }


  globalFilterColumn = [
    'from',
    'to',
    'reason',
    'status',
    'actions'
  ];

  columns = [
    { header: 'From', field: 'from', fieldName: 'from' },
    { header: 'To', field: 'to', fieldName: 'to' },
    { header: 'Reason', field: 'reason', fieldName: 'reason' },
    { header: 'Status', field: 'status', fieldName: 'status' },
    { header: 'Actions', field: 'actions', fieldName: 'actions'}
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