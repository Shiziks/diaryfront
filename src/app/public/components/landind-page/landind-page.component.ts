import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { TestemonialsService } from '../../services/testemonials.service';
import * as dummyTestemonials from './testemonials.json'

@Component({
  selector: 'app-landind-page',
  templateUrl: './landind-page.component.html',
  styleUrls: ['./landind-page.component.css']
})
export class LandindPageComponent implements OnInit, AfterViewInit, OnDestroy {

  testemonials: any[] = [];
  dummyTestemonials = dummyTestemonials;
  difference: number = 0;
  shuffeledDummyT: any[] = [];
  formatedData: any;
  url: string = "http://127.0.0.1:8000/";
  sub!: Subscription;


  constructor(private elementRef: ElementRef, private router: Router, private testemonialsService: TestemonialsService) { }

  ngOnInit(): void {
    this.sub = this.testemonialsService.getAllTestemonials().pipe(map((t: any) => {
      t.forEach((element: any) => {
        if (element.path != null) {
          let path = element.path;
          element.path = this.url + path;
        }
      });
      return t;
    })).subscribe({
      next: result => {
        this.testemonials = result;
        this.formatedData = this.formatData(result);
      },
      error: er => {
        this.formatData([]);
        console.log(er);
      }
    });
  }

  ngAfterViewInit() {
    this.elementRef.nativeElement.ownerDocument
      .body.style.backgroundColor = 'white';
    ///menja boju pozadine u belu i vraca je u sivu na destroy
  }

  ngOnDestroy() {
    this.elementRef.nativeElement.ownerDocument
      .body.style.backgroundColor = '#E1E5EE';
    this.sub.unsubscribe();
  }

  toRegister() {
    this.router.navigate(['/register']);
  }

  calculateNumber(num: number, part?: number) {
    return Math.ceil(this.testemonials.length / num);
  }

  formatData(data: any) {
    let newData = data;
    let len = data.length;
    if (len < 12) {
      this.difference = 12 - len;
      this.shuffeledDummyT = this.shuffle(this.dummyTestemonials.testemonials);
      for (let i = 0; i < this.difference; i++) {
        newData.push(this.shuffeledDummyT[i]);
      }
    }
    else {
      newData = this.shuffle(data);
    }
    return newData;
  }

  shuffle(ar: any) {
    ar.sort(() => (Math.random() > .5) ? 1 : -1);
    return ar;
  }

}
