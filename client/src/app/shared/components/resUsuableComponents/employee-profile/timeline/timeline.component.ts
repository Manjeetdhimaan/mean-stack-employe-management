import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AdminService } from 'src/app/modules/admin/services/admin.service';

@Component({
  selector: 'app-reusable-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss', '../employee-profile.component.scss']
})
export class TimelineReusalbleComponent implements OnInit {

  constructor(private adminService: AdminService) { }


  @Input() profileImageUrl:any;
  @Input() userDetails:any;
  @Input() isAdmin:boolean = false;
  @Output() deleteEmitter : EventEmitter<any> = new EventEmitter();

  ngOnInit(): void {
  }

  onDeleteEmp(id: number) {
    this.deleteEmitter.emit(null);
  }

}
