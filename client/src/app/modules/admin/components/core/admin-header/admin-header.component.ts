import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { DiscardChangesComponent } from 'src/app/shared/components/ui-components/discard-changes/discard-changes.component';
import { AdminService } from '../../../services/admin.service';
import { AddEmployeeComponent } from '../../add-employee/add-employee.component';

@Component({
  selector: 'app-admin-header',
  templateUrl: './admin-header.component.html',
  styleUrls: ['./admin-header.component.scss']
})
export class AdminHeaderComponent implements OnInit {

  @ViewChild('sidenav') sidenav: MatSidenav;
  opened: boolean;
  displayNavbar: boolean;
  @ViewChild('modalBackground') modalBackground: ElementRef;

  constructor(private router: Router, private adminService: AdminService, public dialog: MatDialog) { }

  @ViewChild('sidenavContent') sidenavContent: ElementRef;

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
    this.sidenavContent.nativeElement.style.filter = this.sidenav.opened ? 'blur(8px)' : 'blur(0)'

  }

  navigate(route: string) {
    // close sidenav while navigating to another component or route
    this.sidenav.close();
    // enable body scrolling while sidenav is closed
    document.body.style.overflow = 'auto';
    this.router.navigateByUrl(route);
  }

  openDialog(): void {
    this.modalBackground.nativeElement.style.filter = 'blur(8px)';
    const dialogRef = this.dialog.open(AddEmployeeComponent, {
      width: '1040px'
    });
    this.sidenav.close();
    dialogRef.afterClosed().subscribe(result => {
      document.body.style.overflow = 'auto';
      this.modalBackground.nativeElement.style.filter = 'blur(0)';
    
    });
  }

  onLogOut() {
    this.modalBackground.nativeElement.style.filter = 'blur(8px)';
    const dialogRef = this.dialog.open(DiscardChangesComponent, {
      width: '300px',
      // panelClass: ['animate__animated','animate__slideInUp'],
      data: { confirmBtnText: 'Logout', cancelBtnText: 'Cancel', confirmationText: 'Are you sure you want to logout?', confirmParameter: 'logout' }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result)
      this.modalBackground.nativeElement.style.filter = 'blur(0)';
     
      if (!result) {
        return;
      }
      this.sidenav.close();
      this.adminService.deleteToken();
      this.router.navigate(['/admin/login']);
    });

  }

}
