import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { faCaretLeft } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { ActivityService } from '../../services/activity.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-activity-view',
  templateUrl: './activity-view.component.html',
  styleUrls: ['./activity-view.component.css']
})
export class ActivityViewComponent implements OnInit, OnDestroy {

  icon = faCaretLeft;
  userSteps: any[] = [];
  userId: number = 0;
  collection: any[] = [];
  valueBar: string = '';
  pie: boolean = true;
  valuePie: string = '';
  userWorkouts: any[] = [];
  sub: Subscription[] = [];

  constructor(private router: Router, private activityService: ActivityService) { }

  ngOnInit(): void {
    this.userId = Number(localStorage.getItem('user_id'));
    if (this.userId != 0) {
      let sub1 = this.activityService.getAllUserSteps(this.userId).subscribe({
        next: result => {
          this.collection = [...result.data];
          this.userSteps = result.data;
        },
        error: err => {
          console.log(err);
        }
      });
      this.sub.push(sub1);
      let sub2 = this.activityService.getAllWorkouts(this.userId).subscribe({
        next: result => {
          console.log(result);
          this.userWorkouts = result.data;
        },
        error: er => {
          console.log(er);
        }
      });
      this.sub.push(sub2);
    }
    else {
      this.router.navigate(['/mistake']);
    }

  }

  goBack() {
    this.router.navigate(['profile']);
    localStorage.removeItem('daylog_info');
  }

  getEmitedValueLineChart(element: any) {
    this.valueBar = element;
  }

  getEmitedValuePieChart(element: any) {
    this.valuePie = element;
  }

  ngOnDestroy() {
    if (this.sub.length > 0) {
      this.sub.forEach((subscription) => subscription.unsubscribe());
    }
  }
}
