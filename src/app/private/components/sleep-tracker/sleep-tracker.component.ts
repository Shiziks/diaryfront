import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SleepService } from '../../services/sleep.service';
import { EventEmitter, Output } from '@angular/core';
import { DisableProfileSettingsService } from '../../services/disable-profile-settings.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-sleep-tracker',
  templateUrl: './sleep-tracker.component.html',
  styleUrls: ['./sleep-tracker.component.css']
})
export class SleepTrackerComponent implements OnInit, OnDestroy {

  invert = false;
  max: number = 0;
  min: number = 0;
  step = 1;
  thumbLabel = true;
  showTicks = false;
  value = 0;
  autoTicks = false;
  tickInterval = 1;
  vertical = false;
  userId: any;
  errorMessage: boolean = false;
  sub: Subscription[] = [];

  currentDate: string = new Date().toLocaleString("fr-CA", { year: 'numeric', month: 'numeric', day: 'numeric' });

  sleepHoursId: any;

  @Output() newItemEvent = new EventEmitter<any>();


  constructor(private sleepService: SleepService,
    private router: Router,
    private disableSettings: DisableProfileSettingsService
  ) { }

  ngOnInit(): void {
    let sub1 = this.sleepService.getSleepHours().subscribe({
      next: result => {
        this.min = result[0].hours;
        this.max = result[result.length - 1].hours;
      },
      error: er => {
        //console.log(er);
        this.router.navigate(['/mistake']);
      }
    });
    this.sub.push(sub1);
    this.userId = localStorage.getItem('user_id');

    if (this.userId) {
      let sub2 = this.sleepService.getCurrentSleepingHours(this.userId).subscribe({
        next: result => {
          if (result.data != null) {
            let tmpDate = new Date(result.data.created_at).toLocaleString("fr-CA", { year: 'numeric', month: 'numeric', day: 'numeric' });
            if (tmpDate === this.currentDate) {
              localStorage.setItem('sleep_info', JSON.stringify(result.data));
              this.value = result.data.sleep_hours;
            }
            else {
              localStorage.removeItem('sleep_info')
            }
          }
        },
        error: er => {
          //console.log(er);
          this.router.navigate(['/mistake']);
        }
      });
      this.sub.push(sub2);
    }
    else {
      this.router.navigate(['/mistake']);
    }
  }



  ///SET SLEEP HOURS
  setSleepHours() {
    if (!localStorage.getItem('sleep_info')) {
      this.userId = localStorage.getItem('user_id');
      if (this.userId && this.value > 0) {
        let userSleep = {
          'user_id': this.userId,
          'sleep_hours': this.value
        }
        let sub3 = this.sleepService.setSleepHours(userSleep).subscribe({
          next: result => {
            localStorage.setItem('sleep_info', JSON.stringify(result.data));
          },
          error: er => {
            console.log(er);
            this.errorMessage = true;
            setTimeout(() => {
              this.errorMessage = false;
            }, 2000);
          }
        });
        this.sub.push(sub3);
      }
      else this.router.navigate(['mistake']);
    }
    else {
      let tmp = JSON.parse(localStorage.getItem('sleep_info') || "");
      if (tmp != "") {
        let userSleep = {
          'user_id': this.userId,
          'sleep_hours': this.value,
          'id': tmp.id
        }
        let sub4 = this.sleepService.updateUserSleep(userSleep).subscribe({
          next: result => {
            if (result) {
              localStorage.setItem('sleep_info', JSON.stringify(userSleep));
            }
          },
          error: er => {
            console.log(er);
            this.errorMessage = true;
            setTimeout(() => {
              this.errorMessage = false;
            }, 2000);
          }
        });
        this.sub.push(sub4);
      }

    }
  }

  ///GETTING THE VALUE FROM SLIDER


  getSliderTickInterval(): number | 'auto' {
    if (this.showTicks) {
      return this.autoTicks ? 'auto' : this.tickInterval;
    }
    else {
      return 0;
    }

  }

  showIntakes() {
    this.router.navigate(['sleepinghoursview']);
  }



  disableIt(data: HTMLElement) {
    let name = data.id;
    let dataToSend = {
      'user_id': this.userId,
      'name': name
    };

    let sub5 = this.disableSettings.disableTheSetting(dataToSend).subscribe({
      next: result => {
        this.newItemEvent.emit(result);
      },
      error: er => {
        console.log(er.message);
        this.errorMessage = true;
        setTimeout(() => {
          this.errorMessage = false;
        }, 2000);
      }
    });
    this.sub.push(sub5);
  }

  ngOnDestroy() {
    if (this.sub.length > 0) {
      this.sub.forEach((subscription) => subscription.unsubscribe());
    }
  }


}
