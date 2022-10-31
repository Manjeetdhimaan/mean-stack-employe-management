import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import {MenuItem} from 'primeng/api';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(private userService: UserService, private router: Router) { }
  display: boolean = false;
  items: MenuItem[];

  ngOnInit(): void {
    this.items = [
      {
          label: 'Home',
          items: [{
                  label: 'New', 
                  icon: 'pi pi-fw pi-home',
                  items: [
                      {label: 'Project'},
                      {label: 'Other'},
                  ]
              },
              {label: 'Open'},
              {label: 'Quit'}
          ]
      },
      {
          label: 'Edit Profile',
          icon: 'pi pi-fw pi-pencil',
          routerLink:"/edit-profile",
        //   items: [
        //       {label: 'Delete', icon: 'pi pi-fw pi-trash'},
        //       {label: 'Refresh', icon: 'pi pi-fw pi-refresh'}
        //   ]
      },
      {
          label: 'Profile',
          icon: 'pi pi-fw pi-user',
          routerLink:"/profile",
        //   items: [
        //       {label: 'Delete', icon: 'pi pi-fw pi-trash'},
        //       {label: 'Refresh', icon: 'pi pi-fw pi-refresh'}
        //   ]
      },
      {
          label: 'Leaves',
          icon: 'pi pi-fw pi-home',
          items: [
              {label: 'Check Leaves', icon: 'pi pi-fw pi-trash', routerLink:'/check-leaves'},
              {label: 'Apply Leaves', icon: 'pi pi-fw pi-refresh', routerLink:'/apply-leaves'}
          ]
      },
      {
          label: 'Logout',
          icon: 'pi pi-fw pi-power-off',
          routerLink:"/",
          command: () => this.onLogOut(),
        //   items: [
        //       {label: 'Delete', icon: 'pi pi-fw pi-trash'},
        //       {label: 'Refresh', icon: 'pi pi-fw pi-refresh'}
        //   ]
      }
  ];
  }
  
  onLogOut() {
    this.userService.deleteToken();
    this.router.navigate(['/']);
  }
}
