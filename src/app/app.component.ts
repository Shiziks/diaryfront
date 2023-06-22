
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],

})
export class AppComponent implements OnInit {

  @ViewChild('topScrollAnchor') topScroll!: ElementRef;

  constructor() { }

  ngOnInit(): void {

  }

  onNavigate(event: any): any {
    console.log(event);
    this.topScroll.nativeElement.scrollIntoView({ behavior: 'smooth' });
  }

}



