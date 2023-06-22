
import { Component, ElementRef, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { IDayLog } from '../../interfaces/i-day-log';
import { faCaretDown, faCaretLeft, faCaretUp, faXmark } from '@fortawesome/free-solid-svg-icons';
import { DaylogService } from '../../services/daylog.service';
import { Router } from '@angular/router';
import { IImages } from '../../interfaces/i-images';
import { mergeMap, map, Observable, tap, concatAll, concat } from 'rxjs';
import { DaylogEditService } from '../../services/daylog-edit.service';
import { Idaylogedit } from '../../interfaces/i-daylogedit';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { faPlus, faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { ImagescheckService } from '../../services/imagescheck.service';
import { ImagemodalComponent } from '../imagemodal/imagemodal.component';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Overlay } from '@angular/cdk/overlay';



@Component({
  selector: 'app-day-log-view',
  templateUrl: './day-log-view.component.html',
  styleUrls: ['./day-log-view.component.css']
})
export class DayLogViewComponent implements OnInit {

  constructor(
    private router: Router,
    private daylogeditservice: DaylogEditService,
    private daylogService: DaylogService,
    private imagesCheckService: ImagescheckService,
    private matDialog: MatDialog,
    private overlay: Overlay

  ) {
    this.editDayLogForm = new FormGroup({
      titleTs: new FormControl({ value: "", disabled: false }, [Validators.required, Validators.minLength(2), Validators.maxLength(120)]),
      textTs: new FormControl({ value: "", disabled: false }, [Validators.required, Validators.minLength(3), Validators.maxLength(1500)]),
    });
  }

  // @Input() daylogInfo?:IDayLog;
  daylogInfo!: Idaylogedit;
  allImages: IImages[] = [];
  images?: IImages[] = [];
  length: any = 0;
  displayStyle = "block";
  image_path: string = "";
  imagesTrue: boolean = false;
  daylogTrue: boolean = false;
  dayLogId: number = 0;
  daylog_info$?: Observable<Idaylogedit>;
  subscription: any;
  edited: boolean = false;
  helperTitleText = "To edit a Daylog simply click on title or text area type or edit and when you are done click on the save button.";
  helperImageText = "To view or delete click on an image. To add an image click on add button.";
  helperImageText2 = "To add images click on the button above";
  userId?: string;

  files: any;
  filenames: any;
  errorMessage: any;
  showErrors: boolean = false;
  uploaded: boolean = false;
  fileToSend?: FormData;
  modalopen: boolean = false;
  imageId: number = 0;
  showAdd: boolean = false;
  linkText: string = "Add Images";

  editDayLogForm!: FormGroup;

  faCaretLeft = faCaretLeft;
  faPlus = faPlus;
  faIcon = faCaretDown;
  faInfo = faCircleInfo;
  faXmark = faXmark;

  valueFromModal: boolean = false;
  disableSave: boolean = false;
  deleteError: string = '';




  ngOnInit(): void {
    if (!localStorage.getItem('daylog_info')) {
      this.subscription = this.daylogeditservice.shareThisDayLog.subscribe({
        next: res => {
          this.daylogInfo = res;
          localStorage.setItem('daylog_info', JSON.stringify(res));
          this.dayLogId = res.daylog_id;

          this.editDayLogForm.patchValue({ 'titleTs': res.title, 'textTs': res.text });
          if (res.images.length != 0) {
            this.length = res.images.length;
            this.images = res.images;
          }
        },
        error: er => {
          console.log(er);
          this.router.navigate(['/profile']);
        }
      });

    }
    else {
      this.daylogInfo = JSON.parse(localStorage.getItem('daylog_info') || "{}");
      if (this.daylogInfo.images?.length != 0) {
        this.length = this.daylogInfo.images?.length;
        this.images = this.daylogInfo.images;
      }
      this.dayLogId = this.daylogInfo.daylog_id;
      this.editDayLogForm.patchValue({ 'titleTs': this.daylogInfo.title, 'textTs': this.daylogInfo.text });

    }
    this.userId = localStorage.getItem('user_id') || "";

  }

  ngOnChange() {
    if (this.subscription != null) {
      this.subscription.unsubscribe();
    }
  }

  ngOnDestroy() {
    if (this.subscription != null) {
      this.subscription.unsubscribe();
    }
  }

  ///NA KLICK BACK U BROWSERU
  @HostListener('window:popstate', ['$event'])
  onPopState(event: any) {
    if (this.subscription != null) {
      this.subscription.unsubscribe();
    }
    localStorage.removeItem('daylog_info');
  }


  goBack() {
    if (this.subscription != null) {
      this.subscription.unsubscribe();
    }
    this.router.navigate(['profile']);
    localStorage.removeItem('daylog_info');
  }

  reloadData() {
    this.daylogService.getDayLog(this.dayLogId).subscribe({
      next: res => {
        let result = res;
        this.daylogInfo = result;
        this.length = this.daylogInfo.images?.length;
        this.images = this.daylogInfo.images;
        localStorage.setItem('daylog_info', JSON.stringify(this.daylogInfo));
      },
      error: er => {
        console.log(er);
      }
    });
  }

  openModal(imagepath: string, imageid: number) {
    this.modalopen = true;
    this.image_path = imagepath;

    const scrollStrategy = this.overlay.scrollStrategies.block();
    const dialog = this.matDialog.open(ImagemodalComponent, {
      data: {
        image_path: this.image_path,
        image_id: imageid,
        daylog_id: this.dayLogId,
        user_id: this.userId
      },
      autoFocus: false,
      scrollStrategy,
      panelClass: 'my-dialog',

    });
    dialog.afterClosed().subscribe((res) => {
      if (res.deleted) {
        this.reloadData();
      }
    });
  }

  showAddImage() {
    this.showAdd = !this.showAdd;
    if (this.linkText == "Add Images") {
      this.linkText = "Hide Add Images";
      this.faIcon = faCaretUp;
    }
    else { this.linkText = "Add Images"; this.faIcon = faCaretDown; }
  }


  editDayLog() {
    let dayLog: IDayLog = {
      title: this.editDayLogForm.get('titleTs')?.value,
      text: this.editDayLogForm.get('textTs')?.value,
      daylog_id: this.dayLogId,
      user_id: Number(localStorage.getItem('user_id'))
    }

    let daylogInfo: Idaylogedit = JSON.parse(localStorage.getItem('daylog_info') || "{}");
    this.daylogeditservice.updateDayLog(dayLog).subscribe({
      next: res => {
        this.edited = true;
        setTimeout(() => { this.edited = false }, 2000)
      },
      error: er => { console.log(er); }
    });
    daylogInfo.text = this.editDayLogForm.get('textTs')?.value;
    daylogInfo.title = this.editDayLogForm.get('titleTs')?.value;
    localStorage.setItem('daylog_info', JSON.stringify(daylogInfo));

  }

  checkImages(event: any) {
    if (this.imagesCheckService.checkImages(event, this.length)) {

      this.errorMessage = this.imagesCheckService.errorMessage;
      this.filenames = this.imagesCheckService.filenames;
      this.files = this.imagesCheckService.files;
      this.showErrors = this.imagesCheckService.showErrors;
      if (this.imagesCheckService.showErrors) {
        this.disableSave = true;
      }
      else this.disableSave = false;
    }
  }

  saveImages() {
    if (this.files) {
      this.fileToSend = new FormData();
      if (this.files.length != 0 && this.files.length <= 5 && this.errorMessage.length == 0) {
        for (let i = 0; i < this.files.length; i++) {
          this.fileToSend.append('file[]', this.files[i]);
        }
      }
    }


    if (this.dayLogId != 0 && this.fileToSend) {
      this.fileToSend?.append('user_id', this.userId || '');
      this.fileToSend?.append('daylog_id', String(this.dayLogId) || '');
      //this.fileToSend?.forEach(entries => console.log(entries));

      this.daylogService.uploadImages(this.fileToSend)
        .pipe(mergeMap(res1 => this.daylogeditservice.getAllPostImages(this.dayLogId)
          .pipe(map((imagesarray) => ({ images: imagesarray }))))).subscribe({
            next: res => {
              this.images = res.images;
              this.length = res.images.length;
              this.daylogInfo.images = res.images;
              this.uploaded = true;
              localStorage.setItem('daylog_info', JSON.stringify(this.daylogInfo));
              setTimeout(() => { this.uploaded = false }, 3000);
              this.filenames = "";
              if (this.length == 5) {
                this.showAdd = false;
              }
            },
            error: er => { console.log(er) }
          })

    }

  }

  childEmited(valueEmitted: boolean) {
    this.valueFromModal = valueEmitted;
    if (this.valueFromModal) {
      this.daylogService.getDayLog(this.dayLogId).subscribe({
        next: res => {
          let result = res;
          this.daylogInfo = result;
          this.length = this.daylogInfo.images?.length;
          this.images = this.daylogInfo.images;
          localStorage.setItem('daylog_info', JSON.stringify(this.daylogInfo));
        },
        error: er => {
          console.log(er);
        }
      });
    }
  }


  deleteDaylog() {
    let daylogInfo = {
      'daylog_id': this.daylogInfo.daylog_id,
      'images': this.daylogInfo.images
    };

    this.daylogService.deleteDaylog(daylogInfo).subscribe({
      next: result => {
        localStorage.removeItem('daylog_info');
        this.router.navigate(['/profile']);
      },
      error: er => {
        console.log(er);
        this.deleteError = "Something went wrong, please try again later.";
      }
    });
  }
}
