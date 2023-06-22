import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { ImagescheckService } from 'src/app/private/services/imagescheck.service';
import { WelcomeImageService } from 'src/app/shared/services/welcome-image.service';

@Component({
  selector: 'app-welcome-image',
  templateUrl: './welcome-image.component.html',
  styleUrls: ['./welcome-image.component.css']
})
export class WelcomeImageComponent implements OnInit, OnDestroy {

  subtitle: string = "Current image:";
  subtitle1: string = "Add images:";
  subtitle2: string = "All images:";
  faPlus = faPlus;
  filenames: [] = [];
  disableSave: boolean = true;
  imagesForm!: FormGroup;
  files: [] = [];
  dataToSend!: FormData;
  errorMessage: any;
  showErrors: boolean = false;
  uploaded: boolean = false;
  allImages: any[] = [];
  length: number = 0;
  selectedImage: any;
  sub: Subscription[] = [];

  constructor(private imagesCheck: ImagescheckService, private welcomeImage: WelcomeImageService) {
    this.imagesForm = new FormGroup({
      fileTs: new FormControl("", [Validators.required])

    });
  }

  ngOnInit(): void {
    let sub1 = this.welcomeImage.getImages().subscribe({
      next: result => {
        this.allImages = result;
        this.length = result.length;
        this.selectedImage = result[0];

      },
      error: er => {
        console.log(er);
      }
    });
    this.sub.push(sub1);
  }

  checkImages(event: any) {
    /////POZVATI SERVIS DA SE PROVERE SLIKE
    this.files = event.target.files;
    if (this.imagesCheck.checkImages(event)) {
      this.errorMessage = this.imagesCheck.errorMessage;
      this.filenames = this.imagesCheck.filenames;
      this.files = this.imagesCheck.files;
      this.showErrors = this.imagesCheck.showErrors;
      if (this.imagesCheck.showErrors) {
        this.disableSave = true;
      }
      else this.disableSave = false;
    }


  }

  uploadImages() {
    this.dataToSend = new FormData();
    if (this.files.length != 0 && this.files.length < 6) {
      for (let i = 0; i < this.files.length; i++) {
        this.dataToSend.append('file[]', this.files[i])
      }
    }

    //////DODATI AKO NESTO TREBA NA DATA TO SEND ILI DALJE SLATI NA SERVER
    let sub2 = this.welcomeImage.uploadImages(this.dataToSend).subscribe({
      next: result => {
        this.uploaded = true;
        setTimeout(() => {
          this.uploaded = false;
        }, 2000);
        this.allImages = result;
        this.imagesForm.reset();
      },
      error: er => {
        console.log(er);
      }
    });
    this.sub.push(sub2);

  }


  /////DELTE IMAGE
  deleteImage() {
    let id = {
      'id': this.selectedImage.id,
      'file_name': this.selectedImage.name
    };

    let sub3 = this.welcomeImage.deleteImage(id).subscribe({
      next: result => {
        this.allImages = result;
        this.selectedImage = result[0];
      },
      error: er => {
        console.log(er);
      }
    });
    this.sub.push(sub3);

  }


  /////SELECT IMAGE
  selectImage(element: any) {
    this.selectedImage = element;
  }

  ngOnDestroy() {
    if (this.sub.length > 0) {
      this.sub.forEach((subscription) => subscription.unsubscribe());
    }
  }

}
