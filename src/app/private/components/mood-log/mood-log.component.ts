import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LogService } from '../../services/log.service';
import { Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-mood-log',
  templateUrl: './mood-log.component.html',
  styleUrls: ['./mood-log.component.css']
})
export class MoodLogComponent implements OnInit, OnDestroy {

  linkText = "All your past Moods"
  title = "Mood log:";
  subtitle = "My mood today is:"

  res: any;
  mood = true;
  energy = false;
  currentMood: any;
  sub: Subscription[] = [];

  @Output() emitChange = new EventEmitter<any>();


  constructor(private logService: LogService, private router: Router) { }

  ngOnInit(): void {
    let sub1 = this.logService.getMoods().subscribe({
      next: result => {
        this.res = result.data;
      },
      error: er => {
        console.log(er);
        this.router.navigate(['mistake']);
      }
    });
    this.sub.push(sub1);
    let userId = localStorage.getItem('user_id');
    if (userId && userId != 'null' && userId != undefined) {
      let sub2 = this.logService.getCurrentMood(userId).subscribe({
        next: result => {
          if (result !== null) {
            if (result.mood_id) {
              localStorage.setItem("currentmood_id", result.mood_id);
              localStorage.setItem('usermood_id', result.id);
              this.currentMood = result.mood_id;
            }
          }
          else {
            localStorage.removeItem('currentmood_id');
            localStorage.removeItem('usermood_id');
          }
        },
        error: er => {
          console.log(er.message);
        }
      });
      this.sub.push(sub2);
    }
  }

  changeEmitted(event: any) {
    let data = event;
    this.emitChange.emit(data);
  }


  ngOnDestroy() {
    if (this.sub.length > 0) {
      this.sub.forEach((subscription) => subscription.unsubscribe());
    }
  }

}
