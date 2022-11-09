import { Component, Input, Output, OnInit, ViewChild, ElementRef, AfterViewInit, EventEmitter } from '@angular/core';
import { fromEvent } from 'rxjs'
import { map, merge, delay, mapTo, share, repeat, switchMap, takeUntil } from 'rxjs/operators'
import { fade, slideUp } from 'src/app/shared/common/animations/animations';
@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss'],
  animations: [
    fade,
    slideUp
  ]
})
export class EmployeeComponent implements OnInit, AfterViewInit {
  height: any;
  width: any;
  backgroundImage: any;
  mouseX = 0;
  mouseY = 0;
  get mousePX() {
    return this.mouseX / this.width;
  }
  get mousePY() {
    return this.mouseY / this.height;
  }

  @Input() cardBgImage: string = '';
  @Input() name: string = '';
  @Input() designation: string = '';
  @Input() showActions: boolean = true;
  @Output() checkEmitter: EventEmitter<any> = new EventEmitter();
  @Output() selectUserEmitter: EventEmitter<any> = new EventEmitter();
  // @Input() onCheckOut(): string = '';

  @ViewChild('card', { static: true }) card: ElementRef;
  cardStyling = this.cardStyle();

  onCheck(event: string) {
    this.checkEmitter.emit(event)
  }

  onSelectUser() {
    this.selectUserEmitter.emit(null)
  }

  cardStyle() {
    return this.transformStyle();
  }

  cardBgTransform() {
    return this.transformStyle();
  }

  private transformStyle() {
    const tX = this.mousePX * -30;
    const tY = this.mousePY * -30;
    return { transform: `rotateY(${tX}deg) rotateX(${tY}deg)` };
  }
  get nativeElement(): HTMLElement {
    return this.card.nativeElement;
  }

  image1 = 'https://media.nojoto.com/content/media/207382/2019/06/profile/192e7be8c8de5abba4bcc8d3b6b573dd_207382/default.jpg'
  image2 = 'https://miro.medium.com/max/500/1*cPh7ujRIfcHAy4kW2ADGOw.png'
  image3 = 'https://vuejs.org/images/logo.png'
  image4 = 'https://coryrylan.com/assets/images/posts/types/stenciljs.png'
  images = [this.image1, this.image2, this.image3, this.image4];


  ngOnInit() {
    const mouseMove$ = fromEvent<MouseEvent>(this.card.nativeElement, 'mousemove');
    const mouseLeave$ = fromEvent<MouseEvent>(this.card.nativeElement, 'mouseleave').pipe(
      delay(100),
      mapTo(({ mouseX: 0, mouseY: 0 })),
      share()
    )
    const mouseEnter$ = fromEvent<MouseEvent>(this.card.nativeElement, 'mouseenter').pipe(takeUntil(mouseLeave$))

    mouseEnter$.pipe(
      switchMap(() => mouseMove$),
      map(e => ({ mouseX: e.pageX - this.nativeElement.offsetLeft - this.width / 2, mouseY: e.pageY - this.nativeElement.offsetTop - this.height / 2 }))
      , merge(mouseLeave$), repeat()
    ).subscribe(e => {
      this.mouseX = e.mouseX;
      this.mouseY = e.mouseY;
    })

  }
  ngAfterViewInit() {
    this.width = this.card.nativeElement.offsetWidth;
    this.height = this.card.nativeElement.offsetHeight;
  }
}