import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { SleepService } from 'src/app/private/services/sleep.service';

@Component({
  selector: 'app-sleep',
  templateUrl: './sleep.component.html',
  styleUrls: ['./sleep.component.css']
})
export class SleepComponent implements OnInit, OnDestroy {

  subtitle: string = "All sleeping hours:";
  faPen = faPen;
  subtitle1: string = "Edit or save";
  seleepForm!: FormGroup;
  sleepError: boolean = false;
  sleepHours!: any[];
  showForm: boolean = false;
  pickedHour!: number;
  hourId: number = 0;
  successMessage: boolean = false;
  regExSleep: string = '^[a-z]{1,9}$';
  sub: Subscription[] = [];


  constructor(private sleepService: SleepService) {
    this.seleepForm = new FormGroup({
      sleepTs: new FormControl("", [Validators.required, Validators.minLength(2), Validators.maxLength(15), Validators.pattern(this.regExSleep)])
    });
  }

  ngOnInit(): void {
    let sub1 = this.sleepService.getSleepHours().subscribe({
      next: result => {
        this.sleepHours = result;
      },
      error: er => {
        console.log(er);
        this.sleepError = true;
      }
    });
    this.sub.push(sub1);
  }

  editHours(element: HTMLElement) {
    this.seleepForm.reset();
    this.seleepForm.markAsPristine();
    this.showForm = true;
    this.hourId = Number(element.id);
    let index = Number(element.id);
    this.pickedHour = this.sleepHours[index - 1].hour;
    this.seleepForm.patchValue({
      sleepTs: this.pickedHour
    });
  }


  saveChanges() {
    let data = {
      id: this.hourId,
      hour: this.seleepForm.get('sleepTs')?.value
    }
    let sub2 = this.sleepService.editSleepHour(data).subscribe({
      next: result => {
        this.sleepHours = result;
        this.showForm = false;
        this.seleepForm.markAsPristine();
        this.successMessage = true;
        setTimeout(() => {
          this.successMessage = false;
        }, 2000);
      },
      error: er => {
        console.log(er);
        this.sleepError = true;
        setTimeout(() => {
          this.sleepError = false;
        }, 2000);
      }
    });
    this.sub.push(sub2);
  }

  ngOnDestroy() {
    if (this.sub.length > 0) {
      this.sub.forEach((subscription) => subscription.unsubscribe());
    }
  }

}
