import { trigger, state, query,animate,keyframes, transition, style } from '@angular/animations';




export const fadeInSlideOutAnimation =
    trigger('fadeInSlideOutAnimation', [
        transition(':enter', [
            style({ opacity: 0,transform:'scale(1)'}),

            animate('.3s', style({ opacity: 1 }))
        ]),

        transition(':leave',[
             query('img, h5',animate(900,keyframes([
                 style({opacity:.8,transform:'translateX(-15%)',offset:0.2}),
                 style({opacity:.7,transform:'translateX(-25%) translateY(5%)',offset:0.4}),
                 style({opacity:.6,transform:'translateX(-30%) translateY(-15%)',offset:0.5}),
                 style({opacity:.5,transform:'translateX(-40%) translateY(5%)',offset:0.7}),
                 style({opacity:0,transform:'translateX(-50%) translateY(-25%)',offset:1}),
                 ]))),
            animate('.4s',style({ transform:'translateX(20%) scale(1.1)',opacity:0}))])
    ]);

   

export const slideInOutAnimation =
    trigger('slideInOutAnimation', [

   state('*', style({
            // the view covers the whole screen with a semi tranparent background
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.8)'
        })),
        // route 'enter' transition
        transition(':enter', [

            // styles at start of transition
            style({
                // start with the content positioned off the right of the screen, 
                // -400% is required instead of -100% because the negative position adds to the width of the element
                right: '-400%',

                // start with background opacity set to 0 (invisible)
                backgroundColor: 'rgba(0, 0, 0, 0)'
            }),

            // animation and styles at end of transition
            animate('.5s ease-in-out', style({
                // transition the right position to 0 which slides the content into view
                right: 0,

                // transition the background opacity to 0.8 to fade it in
                backgroundColor: 'rgba(0, 0, 0, 0.8)'
            }))
        ]),

        // route 'leave' transition
        transition(':leave', [
            // animation and styles at end of transition
            animate('.5s ease-in-out', style({
                // transition the right position to -400% which slides the content out of view
                right: '-400%',

                // transition the background opacity to 0 to fade it out
                backgroundColor: 'rgba(0, 0, 0, 0)'
            }))
        ])
    ]);