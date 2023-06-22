import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  isAuth: any;
  link: string = "/home";

  constructor() { }

  ngOnInit(): void {
  }

  checkAuth() {
    if (localStorage.getItem('_auth')) {
      this.isAuth = true;
      this.link = '/profile';
    }
    else {
      this.isAuth = false;
      this.link = '/home';
    }
  }
}
