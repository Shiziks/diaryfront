import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DaylogService } from '../../services/daylog.service';
import { faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons';
import { IDayLog } from '../../interfaces/i-day-log';
import { ImagescheckService } from '../../services/imagescheck.service';
import { DisableProfileSettingsService } from '../../services/disable-profile-settings.service';
import { CloseViewService } from '../../services/close-view.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-post-form',
  templateUrl: './post-form.component.html',
  styleUrls: ['./post-form.component.css']
})
export class PostFormComponent implements OnInit, OnDestroy {


  faIcon = faCaretDown;
  isDisabled = false;
  buttondisabled = true;
  user_id: number = 0;
  filenames: any;
  errorMessage: string[] = [];
  showErrors = false;
  files: any;
  daylog: any;
  daylog_id = 0;
  dayLogForm: FormGroup;
  fileToSend?: FormData;
  successMessage = false;
  linkText: string = "Show all Day Logs";
  dayLogs: boolean = false;
  allLogs: any;
  sub: Subscription[] = [];

  closeViewSubscription?: Subscription;

  @Output() showDaylogs = new EventEmitter<boolean>();
  @Output() allDayLogs = new EventEmitter<IDayLog[]>();
  @Output() disableSetting = new EventEmitter<any>();


  constructor(private daylogService: DaylogService,
    private imagesCheckService: ImagescheckService,
    private disableSettings: DisableProfileSettingsService,
    private closeView: CloseViewService
  ) {
    this.dayLogForm = new FormGroup({
      titleTs: new FormControl({ value: "", disabled: false }, [Validators.required, Validators.minLength(2), Validators.maxLength(120)]),
      textTs: new FormControl({ value: "", disabled: false }, [Validators.required, Validators.minLength(3), Validators.maxLength(1500)]),
      imageTs: new FormControl({ value: "", disabled: false }, [Validators.nullValidator]),
    });
  }

  ngOnInit(): void {
    this.user_id = Number(localStorage.getItem('user_id'));
    let sub1 = this.closeView.emitterClose.subscribe((data: boolean) => {
      if (!data) {
        this.showDayLog();
      }
    });
    this.sub.push(sub1);
  }

  submitPost() {

    if (localStorage.getItem('user_id') != null) {

      let daylog = {
        user_id: this.user_id,
        text: this.dayLogForm.get('textTs')?.value,
        title: this.dayLogForm.get('titleTs')?.value
      }

      if (this.files) {
        this.fileToSend = new FormData();
        if (this.files.length != 0 && this.errorMessage.length == 0) {
          for (let i = 0; i < this.files.length; i++) {
            this.fileToSend.append('file[]', this.files[i]);
          }
        }

      }

      let sub2 = this.daylogService.postDaylog(daylog).subscribe({
        next: result => {
          this.daylog = result;
          this.daylog_id = this.daylog.data.id;
          this.successMessage = true;

          if (this.daylog_id != 0 && this.fileToSend) {
            this.fileToSend?.append('user_id', String(this.user_id) || '');
            this.fileToSend?.append('daylog_id', String(this.daylog_id) || '');
            let sub3 = this.daylogService.uploadImages(this.fileToSend).subscribe({
              next: result => {
                this.successMessage = true;
              },
              error: er => {
                console.log(er);
                this.successMessage = false;
              }
            });
            this.sub.push(sub3);
          }

        },
        error: er => {
          console.log(er);
          this.successMessage = false;
        }
      });
      this.sub.push(sub2);
      this.dayLogForm.reset();
      setTimeout(() => { this.successMessage = false }, 3000);
      this.showDayLog();
      this.filenames = "";
      this.dayLogForm.get('titleTs')?.disable();
      this.dayLogForm.get('textTs')?.disable();
      this.dayLogForm.get('imageTs')?.disable();
    }
  }


  checkImages(event: any) {
    if (this.imagesCheckService.checkImages(event)) {
      this.errorMessage = this.imagesCheckService.errorMessage;
      this.filenames = this.imagesCheckService.filenames;
      this.files = this.imagesCheckService.files;
      this.showErrors = this.imagesCheckService.showErrors;
    }
  }

  showDayLog() {
    this.dayLogs = !this.dayLogs;
    this.showDaylogs.emit(this.dayLogs);
    !this.dayLogs ? this.linkText = "Show all Day Logs " : this.linkText = "Hide all Day Logs ";
    !this.dayLogs ? this.faIcon = faCaretDown : this.faIcon = faCaretUp;



    let sub4 = this.daylogService.allUserDayLogs(Number(this.user_id)).subscribe({
      next: result => {
        this.allLogs = result;
        this.allDayLogs.emit(this.allLogs.data);
      },
      error: er => {
        console.log(er);
      }
    });
    this.sub.push(sub4);
  }


  disableIt(data: HTMLElement) {
    let name = data.id;
    let dataToSend = {
      'user_id': this.user_id,
      'name': name
    };

    let sub5 = this.disableSettings.disableTheSetting(dataToSend).subscribe({
      next: result => {
        this.disableSetting.emit(result);
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
