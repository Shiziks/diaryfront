import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { faDumbbell, faShoePrints } from '@fortawesome/free-solid-svg-icons';
import { ActivityService } from '../../services/activity.service';
import { EventEmitter, Output } from '@angular/core';
import { DisableProfileSettingsService } from '../../services/disable-profile-settings.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-activity-log',
  templateUrl: './activity-log.component.html',
  styleUrls: ['./activity-log.component.css']
})
export class ActivityLogComponent implements OnInit, OnDestroy {


  iconShoePrints = faShoePrints;
  iconDumbell = faDumbbell;
  user_id: number = 0;
  placeholder: string = "";
  linkText1: string = "Save Steps";
  todaysLog: boolean = false;
  steps_id: number = 0;
  currentDate = new Date().toLocaleString("fr-CA", { year: 'numeric', month: 'numeric', day: 'numeric' });
  activityForm: FormGroup;
  functionCall: any;
  loggedWorkout: boolean = false;
  workoutPlaceholder: string = "Workedout today?";
  workoutAlreadyLogged: boolean = false;
  workoutId: number = 0;
  successMessage: string = "";
  errorMessage: string = "";
  messageToShow: boolean = true;
  activeSubcategories: any;
  sub: Subscription[] = [];

  @Output() newItemEvent = new EventEmitter<any>();



  constructor(private activityService: ActivityService,
    private router: Router,
    private disableSettings: DisableProfileSettingsService
  ) {
    this.activityForm = new FormGroup({
      stepsTs: new FormControl(null, [Validators.required, Validators.min(1), Validators.pattern('[0-9]*')]),
      workoutTs: new FormControl({}, [Validators.nullValidator])
    });
  }


  ngOnInit(): void {
    let sub1 = this.activityService.getCatSubcategories('activity').subscribe((value: any) => {
      this.activeSubcategories = value;
    });
    this.sub.push(sub1);

    this.user_id = Number(localStorage.getItem('user_id'));
    let sub2 = this.activityService.getAllUserSteps(this.user_id).subscribe({
      next: result => {
        if (result.data.length != 0) {
          let tmp = result.data[0];
          let tmpDate = new Date(tmp.created_at).toLocaleString("fr-CA", { year: 'numeric', month: 'numeric', day: 'numeric' });
          if (tmpDate == this.currentDate) {
            this.steps_id = tmp.step_id;
            this.placeholder = tmp.step_count;
            this.activityForm.get('stepsTs')?.setValue(tmp.step_count);
            this.linkText1 = "Update Steps";
            this.todaysLog = true;
            localStorage.setItem('steps_info', JSON.stringify(tmp));
          }
          else {
            localStorage.removeItem('steps_info');
          }
        }
      },
      error: er => {
        console.log(er);
      }
    });
    this.sub.push(sub2);
    this.placeholder = "Your daily steps?";
    this.linkText1 = "Save Steps";
    this.todaysLog = false;

    let sub3 = this.activityService.getAllWorkouts(this.user_id).subscribe({
      next: result => {
        if (result.data.length > 0) {
          let tmpDate = new Date(result.data[0].created_at).toLocaleString("fr-CA", { year: 'numeric', month: 'numeric', day: 'numeric' });
          if (tmpDate == this.currentDate) {
            localStorage.setItem('workout_info', JSON.stringify(result.data[0]));
            this.loggedWorkout = true;
            this.workoutPlaceholder = "Workout logged."
            this.workoutAlreadyLogged = true;
            this.workoutId = result.data[0].id;
          }
        }
      },
      error: er => {
        console.log(er.message);
      }
    });
    this.sub.push(sub3);
  }

  logWorkout() {
    if (!this.workoutAlreadyLogged) {
      let dataToSend = {
        user_id: this.user_id,
        workout: 1
      }
      let sub4 = this.activityService.saveWorkout(dataToSend).subscribe({
        next: result => {
          if (result.data) {
            localStorage.setItem('workout_info', JSON.stringify(result.data));
            this.loggedWorkout = true;
            this.workoutPlaceholder = "Your workout is logged."
            this.workoutAlreadyLogged = true;
            this.workoutId = result.data.id;
          }
          else {
            this.loggedWorkout = false;
          }

        },
        error: er => {
          console.log(er.message);
          this.loggedWorkout = false;
        }
      });
      this.sub.push(sub4);
    }
    else {
      if (this.workoutId != 0) {
        let dataToSend = {
          id: this.workoutId
        }
        let sub5 = this.activityService.deleteworkout(dataToSend).subscribe(
          {
            next: result => {
              this.workoutAlreadyLogged = false;
              this.loggedWorkout = false;
              this.workoutPlaceholder = "Workedout today?";
              localStorage.removeItem('workout_info');
            },
            error: er => {
              console.log(er.message);
            }
          }
        );
        this.sub.push(sub5);
      }
    }
  }

  logSteps(element: HTMLInputElement): void {
    if (this.todaysLog && this.steps_id != 0) {
      let dataToSend = {
        user_id: this.user_id,
        step_count: Number(element.value),
        id: this.steps_id
      };
      let sub6 = this.activityService.updateStepLog(dataToSend).subscribe({
        next: result => {
          this.successMessage = "Steps updated.";
          this.messageToShow = false;
          this.activityForm.get('stepsTs')?.markAsPristine();
          let tmp = JSON.parse(localStorage.getItem('steps_info') || "");
          this.todaysLog = true;
          if (tmp != '') {
            tmp.step_count = element.value;
            localStorage.setItem('steps_info', JSON.stringify(tmp));
          }
          setTimeout(() => {
            this.successMessage = "";
            this.messageToShow = true;
          }, 2000);
        },
        error: er => {
          console.log(er);
          this.errorMessage = "Somthing went wrong."
          this.messageToShow = false;
          setTimeout(() => {
            this.errorMessage = "";
            this.messageToShow = true;
          }, 2000);
        }
      });
      this.sub.push(sub6);
    }
    else {
      if (Number(element.value)) {
        let dataToSend = {
          user_id: this.user_id,
          step_count: Number(element.value)
        }
        let sub7 = this.activityService.saveStepsLog(dataToSend).subscribe({
          next: result => {
            this.successMessage = "Steps saved.";
            this.messageToShow = false;
            if (result.data) {
              this.activityForm.get('stepsTs')?.markAsPristine();
              localStorage.setItem('steps_info', JSON.stringify(result.data));
              this.placeholder = result.data.step_count;
              this.todaysLog = true;
              this.steps_id = result.data.steps_id;
              setTimeout(() => {
                this.successMessage = "";
                this.messageToShow = true;
              }, 2000);
            }
          },
          error: er => {
            console.log(er);
            this.errorMessage = "Somthing went wrong.";
            this.messageToShow = false;
            setTimeout(() => {
              this.errorMessage = "";
              this.messageToShow = true;
            }, 2000);
          }
        });
        this.sub.push(sub7);
      }
      else {
        //potrebno je da funkcija prvo isece sva prazna mesta pa onda proba konverziju u broj
      }
    }
  }

  switchChange(element: any) {
    if (!element.checked) {
      if (this.workoutAlreadyLogged) {
        this.loggedWorkout = false;
        this.workoutPlaceholder = "Delete your wokout log.";
      }
      else {
        this.loggedWorkout = true;
        this.workoutPlaceholder = "Workedout today?";
      }
    }
    else {
      if (this.workoutAlreadyLogged) {
        this.workoutPlaceholder = "Your Workout is logged."
        this.loggedWorkout = true;
      }
      else {
        this.workoutPlaceholder = "Workedout today?";
        this.loggedWorkout = false;
      }
    }

  }

  showLogs() {
    this.router.navigate(['activityview'])
  }


  disableIt(data: HTMLElement) {
    let name = data.id;
    let dataToSend = {
      'user_id': this.user_id,
      'name': name
    };

    let sub8 = this.disableSettings.disableTheSetting(dataToSend).subscribe({
      next: result => {
        this.newItemEvent.emit(result);
      },
      error: er => {
        console.log(er.message);
      }
    });
    this.sub.push(sub8);
  }

  ngOnDestroy() {
    this.sub.forEach((subscription) => subscription.unsubscribe());
  }




}
