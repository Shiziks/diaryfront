import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faCaretLeft } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { SleepService } from '../../services/sleep.service';

@Component({
  selector: 'app-sleep-view',
  templateUrl: './sleep-view.component.html',
  styleUrls: ['./sleep-view.component.css']
})
export class SleepViewComponent implements OnInit, OnDestroy {

  hours: string[] = [];
  userSleepingHours = [];
  valueLine: string = "";
  valuePie: string | number = "";
  pie: boolean = true;
  icon = faCaretLeft;
  collection: any[] = [];
  noData: string = '';
  sub: Subscription[] = [];


  constructor(private router: Router, private sleepService: SleepService) { }

  ngOnInit(): void {
    const user_id = Number(localStorage.getItem('user_id'));
    let sub1 = this.sleepService.getSleepHours().pipe(map(res => {
      let x: any[] = [];
      res.forEach((val: any) => {
        let tmp = val.hour.charAt(0).toUpperCase() + val.hour.slice(1);
        return x.push(tmp);
      });
      return x;
    })).subscribe(val => { this.hours = val; });
    this.sub.push(sub1);


    let sub2 = this.sleepService.getAllUserSleepingHours(user_id).subscribe({
      next: result => {
        if (result.data.length > 0) {
          //presloziti niz da moze da se salje chartu
          this.collection = [...result.data];
          let tmp = result.data.map((element: any) => {
            return {
              mood_id: element.sleep_hours,
              user_id: element.user_id,
              mood_name: element.hour,
              created_at: element.created_at
            }
          });

          this.userSleepingHours = tmp;
        }
        else {
          this.noData = "To see the history of your sleeping hours you have to start logging them first.";
        }
      },
      error: er => {
        console.log(er);
      }
    });
    this.sub.push(sub2);

  }

  getEmitedValueLineChart(value: any) {
    this.valueLine = value;
  }

  getEmitedValuePieChart(value: string | number) {
    this.valuePie = value;
  }

  goBack() {
    this.router.navigate(['profile']);
  }

  ngOnDestroy() {
    if (this.sub.length > 0) {
      this.sub.forEach((subscription) => subscription.unsubscribe());
    }
  }
}
