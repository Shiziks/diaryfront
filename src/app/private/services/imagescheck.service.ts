import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ImagescheckService {

  errorMessage: string[] = [];
  files: any;
  showErrors: boolean = false;
  filenames: any;

  constructor() { }

  checkImages(event: any, length: number = 0) {
    this.errorMessage = [];
    this.files = event.target.files;
    const size = 2000000;
    let fileNamesArray: string[] = [];
    const types = ['image/bmp', 'image/gif', 'image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (this.files.length + length > 5) {
      this.errorMessage.push('Total amount of images you can upload at once is 5.');
      if (length != 0 && length < 5) {
        this.errorMessage.push("You can still add " + (5 - length) + " images.");
      }
      fileNamesArray = [];
    }
    else {
      for (let i = 0; i < this.files.length; i++) {
        fileNamesArray.push(this.files[i].name);
        if (this.files[i].size > size) {
          this.errorMessage.push("File " + this.files[i].name + " must be up to 2MB in size.");
        }
        else if (!types.includes(this.files[i].type.toLowerCase())) {
          this.errorMessage.push("File " + this.files[i].name + " must be of type: jpg, jpeg, png, gif or webp.");
        }
      }
    }
    if (this.errorMessage.length > 0) {
      this.showErrors = true;
    }
    else this.showErrors = false;
    this.filenames = String(fileNamesArray);
    return 1;
  }
}
