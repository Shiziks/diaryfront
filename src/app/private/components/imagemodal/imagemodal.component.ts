import { Component, OnInit, EventEmitter, Output, ElementRef, ViewChild, Inject, OnDestroy } from '@angular/core';
import { ImagesService } from '../../services/images.service';
import { MAT_DIALOG_DATA, MatDialogRef, _closeDialogVia } from '@angular/material/dialog';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-imagemodal',
  templateUrl: './imagemodal.component.html',
  styleUrls: ['./imagemodal.component.css']
})
export class ImagemodalComponent implements OnInit, OnDestroy {

  @Output() sendInfo: EventEmitter<boolean> = new EventEmitter<boolean>();
  image_path: string = "";
  faXmark = faXmark;
  image_id: number = 0;
  user_id: number = 0;
  daylog_id: number = 0;
  image_name: string = "";
  sub!: Subscription;


  constructor(private dalogRef: MatDialogRef<ImagemodalComponent>,
    private imagesService: ImagesService,
    @Inject(MAT_DIALOG_DATA) public data: {
      image_path: string,
      image_id: number,
      daylog_id: number,
      user_id: number
    }
  ) {
    this.image_path = data.image_path;
    this.user_id = data.user_id;
    this.daylog_id = data.daylog_id;
    this.image_id = data.image_id;
    this.image_name = String(data.image_path.split('/').pop());
  }

  ngOnInit(): void {

  }


  deleteImage() {
    this.sub = this.imagesService.deleteImages(this.image_id, this.image_name).subscribe({
      next: res => {
        let data = { deleted: 1 };
        this.dalogRef.close(data);

      },
      error: er => {
        console.log(er);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }
}
