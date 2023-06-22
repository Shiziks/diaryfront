import { Component, OnInit } from '@angular/core';
import { faXmarkCircle, } from '@fortawesome/free-regular-svg-icons';
import {  faArrowLeftLong } from '@fortawesome/free-solid-svg-icons';
import { Location } from '@angular/common'
import { Router } from '@angular/router';

@Component({
  selector: 'app-mistake',
  templateUrl: './mistake.component.html',
  styleUrls: ['./mistake.component.css']
})
export class MistakeComponent implements OnInit {

  faXmark = faXmarkCircle;
  faBack = faArrowLeftLong;

  constructor(private location: Location, private router: Router) { }

  ngOnInit(): void {

  }

  goBack() {
    if (window.history.length == 1) {
      this.router.navigate(['/login/login']);
    }
    else {
      this.location.back();
    }
  }
}
