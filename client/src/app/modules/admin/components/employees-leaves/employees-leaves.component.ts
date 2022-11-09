import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-employees-leaves',
  templateUrl: './employees-leaves.component.html',
  styleUrls: ['./employees-leaves.component.scss']
})
export class EmployeesLeavesComponent implements OnInit {

  constructor(private adminService: AdminService, private router: Router) { }

  imgUrl: string = ''

  users: any;

  showActions: boolean = false;

  ngOnInit(): void {

    this.adminService.getUsers().subscribe(
      (res: any) => {
        this.users = res['users'];
      },
      err => {
        console.log(err);
      }
    );
  }

  onNavigateToUserProfile(user: any) {
    this.router.navigate([`/admin/employees/leaves/check/${user['_id']}`]);
  }

}
