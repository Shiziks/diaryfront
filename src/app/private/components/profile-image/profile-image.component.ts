import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subject, Subscription, tap } from 'rxjs';
import { IImages } from '../../interfaces/i-images';
import { ImagescheckService } from '../../services/imagescheck.service';
import { UserphotosService } from '../../services/userphotos.service';
import { Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile-image',
  templateUrl: './profile-image.component.html',
  styleUrls: ['./profile-image.component.css']
})
export class ProfileImageComponent implements OnInit, OnDestroy {

  @ViewChild('profilePhoto') mainImage!: ElementRef<HTMLElement>;

  imageClicked = false;
  clickedImagePath: string = "";
  clickedImageId: string = "0";
  reset: boolean = false;
  user_id: number = 0;
  profileImage?: IImages;
  @Output() profileImageToSend = new EventEmitter<string>(); //treba da bude difoltna slika dok user nije ucitao ni jednu
  images: IImages[] = [];
  imagesLength: number = 0;
  errorMessage: string[] = [];
  private _changesMade: Subject<void> = new Subject();
  sub: Subscription[] = [];


  constructor(private userPhotos: UserphotosService, private imagesCheck: ImagescheckService, private router: Router) { }

  ngOnInit(): void {
    this.user_id = Number(localStorage.getItem('user_id'));
    if (this.user_id > 0) {
      this.getAllImages(this.user_id);
    }
    else {
      this.router.navigate(['/mistake']);
    }

    let sub1 = this.ChangesMade.subscribe({
      next: result => {
        this.getAllImages(this.user_id);
      }
    });
    this.sub.push(sub1);
  }

  ///////METOD ZA DOHVATANJE PRIVATNOG POLJA TIPA SUBJECT
  get ChangesMade() {
    return this._changesMade;
  }

  ///METOD ZA DOHVATANJE SVIH SLIKA
  getAllImages(user_id: number) {
    let sub2 = this.userPhotos.getUserPhotos(user_id).subscribe({
      next: result => {
        let images = result;
        this.imagesLength = result.length;
        this.images = [];
        for (let i = 0; i < images.length; i++) {
          if (images[i].profile) {
            this.profileImage = images[i];
            this.profileImageToSend.emit(this.profileImage.file_path);
          }
          else {
            this.images.push(images[i]);
          }
        }
      },
      error: er => {
        console.log(er.message);
        this.router.navigate(['/mistake']);
      }
    });
    this.sub.push(sub2);
  }


  focusImage(photo: HTMLElement) {
    let clickedPhotoId = photo.id;
    let index = 0;
    let tmpImage: IImages;
    for (let i = 0; i < this.images.length; i++) {
      if (this.images[i].id == Number(clickedPhotoId)) {
        index = i;
        tmpImage = this.images[i];
        this.images[i] = this.profileImage!;
        this.profileImage = tmpImage;
      }
    }
  }

  deletePhoto(pPhoto: HTMLElement) {
    let profile = pPhoto.getAttribute('data-profile');
    let id = Number(pPhoto.id);
    let name = pPhoto.getAttribute('name');


    let dataToSend = {
      id: id,
      user_id: this.user_id,
      file_name: name,
      profile: profile
    };

    let sub3 = this.userPhotos.deleteUserPhoto(dataToSend).subscribe({
      next: result => {
        let img = result;
        this.images = [];
        if (img.length == 0) {
          this.profileImage = undefined;
          this.profileImageToSend.emit('');
          this.imagesLength = 0;
        }
        else {
          for (let i = 0; i < img.length; i++) {
            if (img[i].profile) {
              this.profileImage = img[i];
              this.profileImageToSend.emit(this.profileImage.file_path);
            }
            else {
              this.images.push(result[i]);
            }
          }
        }

        this.imagesLength = img.length;
      },
      error: er => {
        console.log(er.message);
      }
    });
    this.sub.push(sub3);
  }

  addPhoto(event: any) {
    let files = event.target.files;
    let length = event.target.files.length;
    if (length > 1) {
      this.errorMessage = ["You can only upload one photo at time"];
    }
    else {
      this.imagesCheck.checkImages(event, length);
      if (this.imagesCheck.errorMessage.length > 0) {
        this.errorMessage = this.imagesCheck.errorMessage;
      }
      else {

        let filesToSend: any = new FormData();
        filesToSend.append('file', event.target.files[0]);
        filesToSend.append('user_id', this.user_id);
        filesToSend.append('profile', 1);

        let sub4 = this.userPhotos.addPhoto(filesToSend).subscribe({
          next: result => {
            this.ChangesMade.next();

          },
          error: er => {
            console.log(er.message);
          }
        });
        this.sub.push(sub4);
      }
      //////Kada doda sliku emituje da se promenio niz, a kada se emituje on poziva metod za dohvatanje svihslika
      ///Emituje uz subject ili uz observable, observable emituje jednom i staje nakon izvrsenja, a subject svaku promenu
    }

  }

  makeProfilePhoto(pPhoto: HTMLElement): void {
    let profile = pPhoto.getAttribute('data-profile');
    if (profile == '0') {
      let id = Number(pPhoto.id);
      let dataToSend = {
        id: id,
        user_id: this.user_id
      }
      let sub5 = this.userPhotos.editProfileImage(dataToSend).subscribe({
        next: result => {
          this.ChangesMade.next();
        },
        error: er => {
          console.log(er.message);
        }
      });
      this.sub.push(sub5);
    }
  }

  ngOnDestroy() {
    if (this.sub.length > 0) {
      this.sub.forEach((subscription) => subscription.unsubscribe());
    }
  }
}
