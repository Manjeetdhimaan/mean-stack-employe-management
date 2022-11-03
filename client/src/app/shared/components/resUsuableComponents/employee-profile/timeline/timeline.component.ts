import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-reusable-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss', '../employee-profile.component.scss']
})
export class TimelineReusalbleComponent implements OnInit {

  constructor() { }

  @Input () firstName:string;
  @Input () lastName:string;
  @Input () profileImageUrl:any;
  @Input () userDetails:any;

  ngOnInit(): void {
  }

}
