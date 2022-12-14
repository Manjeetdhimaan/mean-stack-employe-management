import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserService } from '../../../services/user.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss', '../../../../admin/components/core/admin-header/admin-header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

  constructor(private userService: UserService, private router: Router) { }

  @ViewChild('sidenav') sidenav: MatSidenav;

  opened: boolean;
  displayNavbar: boolean;
  isLeavesActive: boolean = false;
  currentUserImgUrl: string;
  currentUserName: any = '';
  subscription: Subscription;
  
  ngOnInit(): void {
    this.isLeavesActive = this.router.url === '/employee/leaves/check' || this.router.url === '/employee/leaves/apply' ? true : false;
    this.displayNavbar = true;

    this.subscription = this.userService.currentUserImgUrl.subscribe((res: any) => {
      this.currentUserName = res.name;
      this.currentUserImgUrl = res.imagePath;
    })

    if (!this.currentUserName || !this.currentUserImgUrl) {
      this.userService.getUserProfile().subscribe((res: any) => {
        this.currentUserImgUrl = res['user']['imagePath'];
        this.currentUserName = res['user']['fullName'];
      })
    }
  }

  // disable body scrolling while sidenav is opened 
  toggleBodyScroll() {
    document.body.style.overflow = this.sidenav.opened ? 'hidden' : 'auto';
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


  navigate(route: string) {
    // close sidenav while navigating to another component or route
    this.sidenav.close();
    // enable body scrolling while sidenav is closed
    document.body.style.overflow = 'auto';
    this.isLeavesActive = route === '/employee/leaves/check' || route === '/employee/leaves/apply' ? true : false;

    this.router.navigate([route]);
  }

  onLogOut() {
    this.sidenav.close();
    this.userService.deleteToken();
    localStorage.removeItem('name');
    document.body.style.overflow = 'auto';
    this.router.navigate(['/employee/login']);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
