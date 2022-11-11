import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { AdminService } from '../../../services/admin.service';

@Component({
  selector: 'app-admin-header',
  templateUrl: './admin-header.component.html',
  styleUrls: ['./admin-header.component.scss']
})
export class AdminHeaderComponent implements OnInit {

  @ViewChild('sidenav') sidenav: MatSidenav;
  opened: boolean;
  displayNavbar: boolean;

  constructor(private router: Router, private adminService: AdminService) { }

  ngOnInit(): void {
    this.displayNavbar = true;
  }

  toggleNavbar() {
    this.sidenav.close();
    if (!this.displayNavbar) {
      this.displayNavbar = true;
    } if (this.displayNavbar) {
      this.displayNavbar = false;
    } else {
      this.displayNavbar = true;
    }
  }

  // disable body scrolling while sidenav is opened and enabling it while sidenav is closed
  toggleBodyScroll() {
    document.body.style.overflow = this.sidenav.opened ? 'hidden' : 'auto';
  }

  navigate(route: string) {
    // close sidenav while navigating to another component or route
    this.sidenav.close();
    // enable body scrolling while sidenav is closed
    document.body.style.overflow = 'auto';
    this.router.navigateByUrl(route);
  }

  onLogOut() {
    this.sidenav.close();
    this.adminService.deleteToken();
    document.body.style.overflow = 'auto';
    this.router.navigate(['/admin/login']);
  }

}
