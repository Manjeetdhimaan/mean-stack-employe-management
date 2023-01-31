import { Component, ViewChild } from '@angular/core';

import { PrimeNGConfig } from 'primeng/api';
import { MatSidenav } from '@angular/material/sidenav';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs';
import { NgProgress } from 'ngx-progressbar';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {

  title = 'Employee Management - Younedia';
  category: string;
  @ViewChild('sidenav') sidenav: MatSidenav;
  opened: boolean;
  isLoggedIn: boolean = false;

  constructor(private primengConfig: PrimeNGConfig, private titleService: Title, private router: Router, private activatedRoute: ActivatedRoute, private metaService: Meta, private progress: NgProgress) { }
   
  rootTitle: string = 'YOUNEDIA | EMPLOYEE MANAGEMENT'
  ngOnInit() {
    this.primengConfig.ripple = true;

    const appTitle = this.titleService.getTitle();
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => {
        let child = this.activatedRoute.firstChild;
        while (child) {
          if (child.firstChild) {
            child = child.firstChild;

          } else if (child.snapshot.data && child.snapshot.data['title']) {
            if (child.snapshot.data['isEmployeeProfile']) {
              let urlParams = ''
              child.params.subscribe((params: any) => {
                urlParams = params['id']
              })
              urlParams = urlParams.split('-').join(' ');
              return this.capitalizeFirstLetter(urlParams);
            }
            return child.snapshot.data['title'];
          } else if (child.snapshot.data && child.snapshot.data['isEmployeeProfile']) {
            let urlParams = ''
            child.params.subscribe((params: any) => {
              urlParams = params['id']
            })
            urlParams = urlParams.split('-').join(' ');
            return this.capitalizeFirstLetter(urlParams);
          } else {
            return ' ';
          }
        }
        return ' ';
      })
    ).subscribe((data: any) => {
      if (data && data.trim() != '') {
        this.titleService.setTitle(data + ` - ${this.rootTitle}`);
      }
      else {
        this.titleService.setTitle(`${this.rootTitle}`);
      }
    });
  }

  capitalizeFirstLetter(string: String) {
    // window.localStorage.setItem
    return string.charAt(0).toUpperCase() + string.slice(1);
  }


  clickHandler() {
    this.sidenav.close();
  }

}
