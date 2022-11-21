import { animate, query, stagger, style, transition, trigger } from '@angular/animations';
import { Component, HostBinding, OnInit } from '@angular/core';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
  animations: [
    trigger('pageAnimations', [
      transition(':enter', [
        query('.hero, form', [
          style({opacity: 0, transform: 'translateY(-100px)'}),
          stagger(-25, [
            animate('1500ms cubic-bezier(0.35, 3, 0.25, 1)', style({ opacity: 1, transform: 'none' }))
          ])
        ], { optional: true })
      ])
    ]),
    trigger('filterAnimation', [
      transition(':enter, * => 0, * => -1', []),
      transition(':increment', [
        query(':enter', [
          style({ opacity: 0, width: '0px' }),
          stagger(50, [
            animate('500ms ease-out', style({ opacity: 1, width: '*' })),
          ]),
        ], { optional: true })
      ]),
      transition(':decrement', [
        query(':leave', [
          stagger(50, [
            animate('500ms ease-out', style({ opacity: 0, width: '0px' })),
          ]),
        ])
      ]),
    ]),
  ]
})
export class NotificationsComponent implements OnInit {
  @HostBinding('@pageAnimations')
  public animatePage = true;
  heroTotal = -1;
  constructor() { }
  products: any[] = [
    {
      productType: 'Notification '
    },
    {
      productType: 'Notification '
    },
    {
      productType: 'Notification '
    },
    {
      productType: 'Notification '
    },
    {
      productType: 'Notification '
    },
    {
      productType: 'Notification '
    },
    {
      productType: 'Notification '
    },
    {
      productType: 'Notification '
    },
    {
      productType: 'Notification '
    },
    {
      productType: 'Notification '
    },
    {
      productType: 'Notification '
    },
    {
      productType: 'Notification '
    },
    {
      productType: 'Notification '
    },
    {
      productType: 'Notification '
    },
  ];

  ngOnInit(): void {
    let count:number =0;
  //   for (let i = 0; i < 15; i++) {
  //     count++;
  //     this.products.push(
  //     {
  //       productType: 'Item ' + count,
  //     })
  // }
  count++
  // let intervalId =  setInterval(() => {
   
  //   if (count === 21 - 1) {
  //     clearInterval(intervalId);
  //     // this.showSpinner = false;
  //   }
  //   this.products.push({
  //     productType: 'Notification ' + count,
  //   })
  //   count++;
  // }, 20);
  }

}
