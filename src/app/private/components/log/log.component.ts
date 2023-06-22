import { Component, Input, OnDestroy, OnInit, SimpleChange } from '@angular/core';
import { Router } from '@angular/router';
import { DisableProfileSettingsService } from '../../services/disable-profile-settings.service';
import { LogService } from '../../services/log.service';
import { Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-log',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.css']
})
export class LogComponent implements OnInit, OnDestroy {

  @Input() title: string = '';
  @Input() subtitle: string = "";
  @Input() mood1: any;
  @Input() res: any;
  @Input() mood: any;
  @Input() energy: any;
  @Input() linkText: string = "Review all your logs";
  @Input() currentmood_id: any;
  @Input() currentenergy_id: any;

  @Output() newItemEvent = new EventEmitter<any>();

  sub: Subscription[] = [];
  addClass = false;
  userId: any;


  constructor(private setMood: LogService,
    private router: Router,
    private disableSettings: DisableProfileSettingsService) { }

  ngOnInit(): void {
    this.userId = localStorage.getItem('user_id');
  }

  onClick(id: any) {
    let moodId = id;
    let energyId = id;

    if (this.mood) {
      if (!localStorage.getItem('usermood_id')) {
        let userMood = {
          "mood_id": moodId,
          "user_id": this.userId
        }

        let sub1 = this.setMood.logMood(userMood).subscribe({
          next: result => {
            this.currentmood_id = moodId; //smesta currentmood_id
            localStorage.setItem('usermood_id', result.id);
            localStorage.setItem('currentmood_id', moodId);
          },
          error: er => {
            console.log(er);
            this.router.navigate(['mistake']);
          }
        });
        this.sub.push(sub1);
      }
      else {
        let userMood = {
          "mood_id": moodId,
          "user_id": this.userId,
          "id": localStorage.getItem('usermood_id')
        }
        let sub2 = this.setMood.updateMood(userMood).subscribe({
          next: result => {
            localStorage.setItem('currentmood_id', moodId);
            this.currentmood_id = moodId;
          },
          error: er => {
            console.log(er.message);
            this.router.navigate(['mistake']);
          }
        });
        this.sub.push(sub2);
      }
    }
    else if (this.energy) {
      if (!localStorage.getItem('userenergy_id')) {
        let userEnergy = {
          'energy_id': energyId,
          'user_id': this.userId
        }

        let sub3 = this.setMood.logEnergy(userEnergy).subscribe({
          next: result => {
            this.currentenergy_id = energyId;
            localStorage.setItem('userenergy_id', result.userenergy_id);
            localStorage.setItem('currentenergy_id', energyId);

          },
          error: er => {
            console.log(er);
          }
        });
        this.sub.push(sub3);
      }
      else {

        let userenergy_id = localStorage.getItem('userenergy_id');
        let userEnergy = {
          'energy_id': energyId,
          'user_id': this.userId,
          'id': userenergy_id
        }
        let sub4 = this.setMood.updateUserEnergy(userEnergy).subscribe({
          next: result => {
            this.currentenergy_id = energyId;
            localStorage.setItem('currentenergy_id', energyId);
          },
          error: er => {
            console.log(er);
          }
        });
        this.sub.push(sub4);
      }


    }
  }

  showMoods(mood: any, energy: any) {
    if (mood) {
      this.router.navigate(['moodsview']);
    }
    else if (energy) {
      this.router.navigate(['energyviews']);
    }
    else {
      this.router.navigate(['profile']);

    }

  }



  ////////////////Disable a component
  disableIt() {
    let data = '';
    if (this.mood) {
      data = 'mood';
    }
    else if (this.energy) {
      data = 'energy';
    }

    let dataToSend = {
      'user_id': Number(this.userId),
      'name': data
    };


    let sub5 = this.disableSettings.disableTheSetting(dataToSend).subscribe({
      next: result => {
        this.newItemEvent.emit(result);
      },
      error: er => {
        console.log(er.message);
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
