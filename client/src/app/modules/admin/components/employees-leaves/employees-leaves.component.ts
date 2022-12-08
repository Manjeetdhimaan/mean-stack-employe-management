import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-employees-leaves',
  templateUrl: './employees-leaves.component.html',
  styleUrls: ['./employees-leaves.component.scss']
})
export class EmployeesLeavesComponent implements OnInit {

  constructor(private adminService: AdminService, private router: Router, private activatedRoute: ActivatedRoute) { }

  imgUrl: string = ''

  users: any;

  showActions: boolean = false;

  totalUsers: number;
  perPage: number = 4;
  currentPage: number
  ngOnInit(): void {
    this.activatedRoute.queryParams
      .subscribe((params) => {
        if (params['page'] && params['page'] >= 1) {
          this.adminService.getUsers(+params['page'], this.perPage).subscribe(
            (res: any) => {
              this.totalUsers = res['counts'];
              this.users = res['users'];
            },
            err => {
              if (err.error.message === 'Admin not found') {
                this.router.navigate(['admin/login']);
              }
            }
          );
        }
        else {
          this.adminService.getUsers(1, this.perPage).subscribe(
            (res: any) => {
              this.totalUsers = res['counts'];
              this.users = res['users'];
            },
            err => {
              console.log(err);
              if (err.error.message === 'Admin not found') {
                this.router.navigate(['admin/login']);
              }
            }
          );
        }
      });

  }

  paginate(event: any) {
    event.first = 2
    // event.rows = Number of rows to display in new page
    // event.page = Index of the new page
    // event.pageCount = Total number of pages
    // this.indexOfRenderedItem = event.page;
    window.scroll({
      top: 0,
      behavior: 'smooth'
    })
    console.log(event.rows)
    this.perPage = event.rows
    this.adminService.getUsers(event.page + 1, event.rows).subscribe(
      (res: any) => {
        this.totalUsers = res['counts'];
        this.users = res['users'];
        console.log(this.users);
        this.router.navigateByUrl(`admin/employees/leaves/check?page=${event.page + 1}`)
      },
      err => {
        if (err.error.message === 'Admin not found') {
          this.router.navigate(['admin/login']);
        }
      }
    );

  }

  onNavigateToUserProfile(user: any) {
    this.router.navigate([`/admin/employees/leaves/check/${user['_id']}`]);
  }

}
