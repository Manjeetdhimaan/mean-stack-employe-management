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
   
  capitalizeFirstLetter(string: String) {
    // window.localStorage.setItem
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  ngOnInit() {
    this.primengConfig.ripple = true;

    const appTitle = this.titleService.getTitle();
    this.router
      .events.pipe(
        filter(event => event instanceof NavigationEnd),
        map(() => {
          //getting name from url 
          let routerUrl_split = this.router.url.slice(1).split("-")
          let result = []
          for (let i = 0; i < routerUrl_split.length; i++) {
            result.push(routerUrl_split[i].slice(0, 1).toUpperCase() + routerUrl_split[i].slice(1))
          }

          let newsUrl_split = this.router.url.slice(6).split("-")
          let newsResult = []
          for (let i = 0; i < newsUrl_split.length; i++) {
            newsResult.push(newsUrl_split[i].slice(0, 1).toUpperCase() + newsUrl_split[i].slice(1))
          }
          const child = this.activatedRoute.firstChild;
          // const employeChild = child?.snapshot.data['title'];
          const newsChild = child?.firstChild?.routeConfig?.data?.['isNews'];
          const employeChild = child?.firstChild?.snapshot.data['title'];
          const categoryChild = child?.firstChild?.routeConfig?.data?.['isCategoryComponent'];
          if (child?.snapshot.data['title']) {
            if (categoryChild) {
              // this.isCategoryComponent = false;
              child.snapshot.data['title'] = this.capitalizeFirstLetter(this.router.url.slice(10).split('-').join(' ')) + ' - Newsfarmers';
              // this.metaService.updateTag({ name: 'description', content: this.capitalizeFirstLetter(this.router.url.slice(10).split('-').join(' ')) });
              return child.snapshot.data['title'];
            }
            if (newsChild) {
              child.snapshot.data['title'] = newsResult.join(" ") + ' - Newsfarmers';
              this.metaService.updateTag({ name: 'description', content: newsResult.join(" ") });
              return child.snapshot.data['title'];
            }
            if (this.router.url.toLowerCase() === "/") {
              if (child?.snapshot.data['title']) {
                child.snapshot.data['title'] = employeChild;
                return child.snapshot.data['title'];
              }
            }
            // if (this.router.url.toLowerCase() === "/category/biographies") {
            //   if (child?.snapshot.data['title']) {
            //     child.snapshot.data['title'] = 'Biographies - Newsfarmers';
            //     return child.snapshot.data['title'];
            //   }
            // }
        
              return child.snapshot.data['title'] as string;
          }
          return appTitle;
        })

      ).subscribe((ttl: string) => {
        this.titleService.setTitle(ttl);
      });
  }


  clickHandler() {
    this.sidenav.close();
  }

}
