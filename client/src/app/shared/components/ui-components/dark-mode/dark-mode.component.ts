import { Component, OnInit } from '@angular/core';

import { DarkModeService } from 'angular-dark-mode';

@Component({
  selector: 'app-dark-mode',
  templateUrl: './dark-mode.component.html',
  styleUrls: ['./dark-mode.component.scss']
})
export class DarkModeComponent implements OnInit {

  constructor(private darkModeService: DarkModeService) {}
  darkMode$ = this.darkModeService.darkMode$;

  ngOnInit(): void {
  }

  onToggle(): void {
    this.darkModeService.toggle();
  }
}
