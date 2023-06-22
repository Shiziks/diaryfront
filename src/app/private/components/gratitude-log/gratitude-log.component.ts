import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, SimpleChange } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { GratitudeService } from '../../services/gratitude.service';
import { faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons';
import { DisableProfileSettingsService } from '../../services/disable-profile-settings.service';
import { CloseGratitudeViewService } from '../../services/close-gratitude-view.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-gratitude-log',
  templateUrl: './gratitude-log.component.html',
  styleUrls: ['./gratitude-log.component.css']
})
export class GratitudeLogComponent implements OnInit, OnDestroy {

  gratitudeForm: FormGroup;
  placeholder: string = "What are you grateful for?"
  gratitudes: any = null;
  user_id: any;
  gratitudeInfo: any;
  gratitude1: string = "";
  gratitude2: string = "";
  gratitude3: string = "";

  successMessage: string = "";
  linkText: string = "Show all Gratitudes";
  faIcon = faCaretDown;

  showMessage: boolean = false;
  showGratitudes: boolean = false;
  showGratitudeValue: boolean = false;
  @Output() showGratitudeEmitter = new EventEmitter<boolean>();
  @Output() newItemEvent = new EventEmitter<any>();

  sub: Subscription[] = [];





  constructor(
    private gratitudeService: GratitudeService,
    private activatedRout: ActivatedRoute,
    private disableSettings: DisableProfileSettingsService,
    private closeGratitudeView: CloseGratitudeViewService) {
    this.gratitudeForm = new FormGroup({
      gratitude1Ts: new FormControl('', [Validators.minLength(3), Validators.maxLength(200), Validators.required]),
      gratitude2Ts: new FormControl('', [Validators.minLength(3), Validators.maxLength(200)]),
      gratitude3Ts: new FormControl('', [Validators.minLength(3), Validators.maxLength(200)])
    });
  }


  ngOnInit(): void {
    this.gratitudeInfo = JSON.parse(localStorage.getItem('gratitude_info') || '{}');

    if (Object.keys(this.gratitudeInfo).length !== 0) {
      this.gratitude1 = this.gratitudeInfo.gratitude1;
      this.gratitude2 = this.gratitudeInfo.gratitude2;
      this.gratitude3 = this.gratitudeInfo.gratitude3;

      this.gratitudeForm.patchValue({
        'gratitude1Ts': this.gratitude1,
        'gratitude2Ts': this.gratitude2,
        'gratitude3Ts': this.gratitude3
      });
    }
    this.user_id = Number(localStorage.getItem('user_id'));

    let sub1 = this.closeGratitudeView.emitterClose.subscribe((data: boolean) => {
      if (!data) {
        this.showAllGratitudes();
      }
    });
    this.sub.push(sub1);





  }


  logGratitudes() {
    let gratitudeInfo = JSON.parse(localStorage.getItem('gratitude_info') || "{}");
    if (Object.keys(gratitudeInfo).length === 0) {

      this.gratitudes = { //pumpa vrednosti iz forme u objekat za slanje
        gratitude1: this.gratitudeForm.get('gratitude1Ts')?.value,
        gratitude2: this.gratitudeForm.get('gratitude2Ts')?.value,
        gratitude3: this.gratitudeForm.get('gratitude3Ts')?.value,
        user_id: this.user_id
      }


      /////CREATE GRATITUDES  
      let sub2 = this.gratitudeService.logGratitudes(this.gratitudes).subscribe({
        next: result => {
          this.successMessage = " *Your gratitudes have been logged.";
          this.showMessage = true;
          setTimeout(() => { this.showMessage = false }, 3000);
          this.gratitudeForm.markAsPristine();

          //pumpa dobijene podatke u promenljivu za localstorage
          let gratitudeInfo: any = {
            group_id: result.data.group_id,
            user_id: this.user_id,
            gratitude_id1: result.data.gratitude1_id,
            gratitude1: this.gratitudes.gratitude1,
            gratitude_id2: result.data.gratitude2_id,
            gratitude2: this.gratitudes.gratitude2,
            gratitude_id3: result.data.gratitude3_id,
            gratitude3: this.gratitudes.gratitude3
          };
          localStorage.setItem('gratitude_info', JSON.stringify(gratitudeInfo));
        },
        error: er => {
          console.log(er);
          this.showMessage = false;
        }
      });
      this.sub.push(sub2);
    }
    else {
      let gratitudeInfo = JSON.parse(localStorage.getItem('gratitude_info') || '{}');
      if (Object.keys(gratitudeInfo).length !== 0) {
        let groupId = gratitudeInfo.group_id;
        let gratitude1_id: any;
        let gratitude2_id: any;
        let gratitude3_id: any;
        this.user_id = gratitudeInfo.user_id;
        if (gratitudeInfo.gratitude_id1) {
          gratitude1_id = gratitudeInfo.gratitude_id1;
        }
        if (gratitudeInfo.gratitude_id2) {
          gratitude2_id = gratitudeInfo.gratitude_id2;
        }
        if (gratitudeInfo.gratitude_id3) {
          gratitude3_id = gratitudeInfo.gratitude_id3;
        }


        /////setting the new property, with new gratitude values, that will be sent to the server
        this.gratitudes = {
          gratitude1: this.gratitudeForm.get('gratitude1Ts')?.value,
          gratitude1_id: gratitude1_id,
          gratitude2: this.gratitudeForm.get('gratitude2Ts')?.value,
          gratitude2_id: gratitude2_id,
          gratitude3: this.gratitudeForm.get('gratitude3Ts')?.value,
          gratitude3_id: gratitude3_id,
          group_id: groupId,
          user_id: this.user_id
        }





        /////UPDATE GRATITUDES
        let sub3 = this.gratitudeService.updateGratitudes(this.gratitudes).subscribe({
          next: result => {
            if (result.gratitude1_id) { gratitude1_id = result.gratitude1_id }
            if (result.gratitude2_id) { gratitude2_id = result.gratitude2_id }
            if (result.gratitude3_id) { gratitude3_id = result.gratitude3_id }
            this.successMessage = " *Your gratitudes have been updated.";
            this.showMessage = true;
            this.gratitudeForm.markAsPristine();


            let groupInfo: any = {
              user_id: this.user_id,
              group_id: groupId,
              gratitude_id1: this.gratitudes.gratitude1 ? gratitude1_id : "",
              gratitude1: this.gratitudes.gratitude1,
              gratitude_id2: this.gratitudes.gratitude2 ? gratitude2_id : "",
              gratitude2: this.gratitudes.gratitude2,
              gratitude_id3: this.gratitudes.gratitude3 ? gratitude3_id : "",
              gratitude3: this.gratitudes.gratitude3
            }
            localStorage.setItem('gratitude_info', JSON.stringify(groupInfo));

          },
          error: er => {
            console.log(er);
            this.showMessage = false;
          }
        });
        this.sub.push(sub3);
      }
      setTimeout(() => { this.showMessage = false }, 3000);
      this.showAllGratitudes();
    }

  }

  /////////SHOW ALL GRATITUDE////////////////////////////////////////////////////////////////////////////
  showAllGratitudes() {
    this.showGratitudeValue = !this.showGratitudeValue;
    this.showGratitudeEmitter.emit(this.showGratitudeValue);

    !this.showGratitudeValue ? this.linkText = "Show all Gratitudes " : this.linkText = "Hide all Gratitudes";
    !this.showGratitudeValue ? this.faIcon = faCaretDown : this.faIcon = faCaretUp;

  }

  //Uraditi validatore za gratitudes



  disableIt(data: HTMLElement) {

    let name = data.id;
    let dataToSend = {
      'user_id': this.user_id,
      'name': name
    };

    let sub4 = this.disableSettings.disableTheSetting(dataToSend).subscribe({
      next: result => {
        this.newItemEvent.emit(result);
      },
      error: er => {
        console.log(er.message);
      }
    });
    this.sub.push(sub4);
  }

  ngOnDestroy(): void {
    if (this.sub.length > 0) {
      this.sub.forEach((subscription) => subscription.unsubscribe());
    }
  }
}
