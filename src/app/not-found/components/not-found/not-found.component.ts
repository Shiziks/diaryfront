import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, } from '@angular/router';
import { Location } from '@angular/common'


@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.css']
})
export class NotFoundComponent implements OnInit {

  previousUrl = "";
  constructor(private router: Router, private location: Location, private route: ActivatedRoute) {
  }

  ngOnInit(): void {
  }

  goBack() {
    if (window.history.length <= 1) {
      this.router.navigate(['/login/login']);
    }
    else {
      this.location.back();
    }
  }
}
