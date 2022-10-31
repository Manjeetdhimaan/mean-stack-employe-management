import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss', '../employe-profile.component.scss']
})
export class TimelineComponent implements OnInit {

  constructor() { }

  @Input () firstName:string;
  @Input () lastName:string;
  @Input () profileImageUrl:any;
  @Input () userDetails:any;

  ngOnInit(): void {
  }

}
