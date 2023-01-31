import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AdminService } from '../../../services/admin.service';

@Component({
  selector: 'app-employee-leaves',
  templateUrl: './employee-leaves.component.html',
  styleUrls: ['./employee-leaves.component.scss']
})
export class EmployeeLeavesComponent implements OnInit {

  constructor(private adminService: AdminService, private activatedRoute: ActivatedRoute) { }

  id: string;

  userDetails: any;
  leaves: any[];
  isAdmin: boolean = true;

  isError: boolean = false;

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.id = params['id'];
    });

    this.adminService.getUser(this.id).subscribe(
      (res: any) => {
        this.userDetails = res['user'];
        this.leaves = this.userDetails.leaves.reverse();
      },
      err => {
        console.log(err);
        if (err.status === 404) {
          this.isError = true;
        }
      }
    );
  }

  onRespondToLeaves(selectedLeave: any) {
    let prevStatus;
    this.leaves.map((leave: any) => {
      if (leave._id == selectedLeave.selectedLeave._id) {
        prevStatus = leave.status;
      }
      if (leave._id == selectedLeave.selectedLeave._id && leave.status == selectedLeave.leaveStatus) {
        console.log('matched');
        return;
      }
    })

    const leaveBody = {
      leaveId: selectedLeave.selectedLeave._id,
      status: selectedLeave.leaveStatus,
      prevStatus: prevStatus,
      domain: environment.domain
    }

    this.adminService.respondToLeaves(this.id, leaveBody).subscribe(
      (res: any) => {
        this.userDetails = res['user'];
        this.leaves = this.userDetails.leaves.reverse();
      },
      err => {
        console.log(err);
        if (err.status === 404) {
          this.isError = true;
        }
      }
    );
  }

}

