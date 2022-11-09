import { animate, animation, animateChild, state, style, transition, trigger, group, query, stagger } from '@angular/animations';

export const slideUp = trigger('slideUp',[
    transition(':enter',[
        style({ transform:'translateY(100vh)'}),
        animate('1000ms cubic-bezier(.61, .29, .07, 1.02)')
    ])
])

export const fade = trigger('fade', [
  state('void',style({ opacity: 0 })),
  transition(':enter, :leave', [
    animate(200)
  ])
]);

export const transAnimation = animation([
  style({
    height: '{{ height }}',
    opacity: '{{ opacity }}',
    backgroundColor: '{{ backgroundColor }}'
  }),
  animate('{{ time }}')
]);

// Routable animations
export const slideInAnimation =
  trigger('routeAnimations', [
    transition('HomePage <=> AboutPage', [
      style({ position: 'relative' }),
      query(':enter, :leave', [
        style({
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%'
        })
      ]),
      query(':enter', [
        style({ left: '-100%'})
      ]),
      query(':leave', animateChild()),
      group([
        query(':leave', [
          animate('300ms ease-out', style({ left: '100%'}))
        ]),
        query(':enter', [
          animate('300ms ease-out', style({ left: '0%'}))
        ])
      ]),
      query(':enter', animateChild()),
    ]),
    transition('* <=> FilterPage', [
      style({ position: 'relative' }),
      query(':enter, :leave', [
        style({
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%'
        })
      ]),
      query(':enter', [
        style({ left: '-100%'})
      ]),
      query(':leave', animateChild()),
      group([
        query(':leave', [
          animate('200ms ease-out', style({ left: '100%'}))
        ]),
        query(':enter', [
          animate('300ms ease-out', style({ left: '0%'}))
        ])
      ]),
      query(':enter', animateChild()),
    ])
  ]);


  export const filterAnimation =
  trigger('filterAnimation', [
    transition(':enter, * => 0, * => -1', []),
    transition(':increment', [
      query(':enter', [
        style({ opacity: 0, width: '0px' }),
        stagger(50, [
          animate('300ms ease-out', style({ opacity: 1, width: '*' })),
        ]),
      ], { optional: true })
    ]),
    transition(':decrement', [
      query(':leave', [
        stagger(50, [
          animate('300ms ease-out', style({ opacity: 0, width: '0px' })),
        ]),
      ])
    ]),
  ])

/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/