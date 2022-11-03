import { Component, Input, OnInit } from '@angular/core';
import { FormatTimeService } from 'src/app/shared/services/time-utils/formatTime.service';

@Component({
  selector: 'app-reusable-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.scss']
})
export class AttendanceReusalbleComponent implements OnInit {

  constructor(public formatTimeService: FormatTimeService) { }

  @Input() attendance: any[] = [];

  globalFilterColumn = [
    'date',
    'entry',
    'exit',
    'exit'
  ];

  columns = [
    { header: 'Date', field: 'date', fieldName: 'entryDate' },
    { header: 'Entry time', field: 'entry', fieldName: 'entryTime' },
    { header: 'Exit time', field: 'exit', fieldName: 'exitTime' },
    { header: 'Exit Type', field: 'exit', fieldName: 'exitType' }
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
    console.log('clicked')
    // this.router.navigateByUrl('/triggers/create');
  }

}