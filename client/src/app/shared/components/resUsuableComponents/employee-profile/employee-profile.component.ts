import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
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
 // timeline component properties
  @Input() userDetails:any={};
  @Input() firstName:string='';
  @Input() lastName:string='';
  @Input() profileImageUrl: any =
    'https://g99plus.b-cdn.net/AEMR/assets/img/profileDefault.png';

    // attendance component properties
  @Input() attendance:any[];
  @Input() payroll:any[];
  // create payroll component properties
  @Input() totalEarning: number = 0;
  @Input() totalDeductions: number = 0;
  @Input() isAdmin: boolean = false;
  @Input() submitted: boolean = false;
  @Input() payRollForm:FormGroup;
  @Output() submitEvent: EventEmitter<any> = new EventEmitter();
  @Output() cancelSubmitEvent: EventEmitter<any> = new EventEmitter();
  @Output() deleteEmitter : EventEmitter<any> = new EventEmitter();

  ngOnInit(): void {
  }

  submit() {
    this.submitEvent.emit(this.payRollForm.value.payForm);
  }
  onCancelSubmit() {
    this.cancelSubmitEvent.emit(null);
  }

  onDeleteEmp(id: number) {
    this.deleteEmitter.emit(id);
  }
}
