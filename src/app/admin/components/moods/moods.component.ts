import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  faFaceGrimace, faFaceGrin, faFaceLaugh, faFaceGrinBeam, faFaceGrinHearts,
  faFaceGrinStars, faFaceGrinTears, faFaceAngry, faFaceDizzy,
  faFaceFlushed, faFaceFrown, faFaceFrownOpen, faFaceGrinBeamSweat, faFaceGrinSquint,
  faFaceGrinWide, faFaceGrinWink, faFaceLaughBeam, faFaceLaughWink, faFaceMeh, faFaceMehBlank,
  faFaceRollingEyes, faFaceSadCry, faFaceSmile, faFaceSadTear, faFaceSmileBeam, faFaceSmileWink, faFaceTired,
  faFaceSurprise, faFaceLaughSquint, faFaceKissWinkHeart, faSquare, IconName
} from '@fortawesome/free-solid-svg-icons'
import { faPen } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { MoodService } from 'src/app/private/services/mood.service';

@Component({
  selector: 'app-moods',
  templateUrl: './moods.component.html',
  styleUrls: ['./moods.component.css']
})
export class MoodsComponent implements OnInit, OnDestroy {

  subtitle: string = "All moods:";
  subtitle1: string = "Change mood and icon:"
  allMoods: any[] = [];
  faPen = faPen;
  faSquare = faSquare;
  moodPlaceholder: string = "";
  iconsId: number = 0;
  currentIconId: number = 0;
  moodId: number = 0;
  iconchange: boolean = true;
  successMessage: boolean = false;
  existingMoodIcons: any[] = [];
  film = "film";
  sub: Subscription[] = [];

  iconNames: IconName[] = ['face-angry', 'face-dizzy', "face-flushed", 'face-frown', 'face-grimace', 'face-laugh',
    'face-frown-open', "face-grin"];

  icons = [faFaceAngry, faFaceDizzy, faFaceFlushed, faFaceFrown, faFaceGrimace, faFaceLaugh,
    faFaceFrownOpen, faFaceGrin, faFaceGrinBeam, faFaceGrinHearts, faFaceGrinStars,
    faFaceGrinTears, faFaceGrinBeamSweat, faFaceGrinSquint, faFaceGrinWide, faFaceGrinWink,
    faFaceLaughBeam, faFaceLaughWink, faFaceMeh, faFaceMehBlank, faFaceRollingEyes,
    faFaceSadCry, faFaceSmile, faFaceSadTear, faFaceSmileBeam, faFaceSmileWink, faFaceTired,
    faFaceSurprise, faFaceLaughSquint, faFaceKissWinkHeart];
  element: any;

  moodForm!: FormGroup;
  moodError: boolean = false;
  changeIcon: boolean = false;
  regExMood: string = '^[a-z]{1,9}$';

  constructor(private moodService: MoodService) {
    this.moodForm = new FormGroup({
      moodTs: new FormControl("", [Validators.required, Validators.minLength(2), Validators.maxLength(10), Validators.pattern(this.regExMood)]),
    });
  }

  ngOnInit(): void {
    let sub1 = this.moodService.getAllMoods().subscribe({
      next: result => {
        this.updateInfo(result.data);
      },
      error: er => {
        console.log(er);
        this.moodError = true;
      }
    });
    this.sub.push(sub1);
  }

  editMood(element: any) {
    this.iconchange = true;
    this.moodForm.reset();
    this.moodForm.markAsPristine();
    this.moodId = element.id;
    let moodicon = element.icon;
    let mood_name = element.mood_name;
    this.icons.forEach((icon: any, index: any) => {
      if (icon.iconName === moodicon) {
        this.currentIconId = index;
      }
    });
    this.moodForm.patchValue({
      moodTs: mood_name
    });
    this.changeIcon = true;
  }

  pickNewIcon(element: any) {
    if (element !== this.currentIconId) {
      this.currentIconId = element;
      this.iconchange = false;
    }
    else {
      this.iconchange = true;
    }
  }

  saveChanges() {
    let mood = this.moodForm?.get('moodTs')?.value;
    let icon = this.icons[this.currentIconId].iconName;
    let data;
    if (!this.iconchange && mood != '') {
      data = {
        'id': this.moodId,
        'mood_name': mood,
        'icon': icon
      };
    }
    else {
      data = {
        'id': this.moodId,
        'mood_name': mood,
      };
    }

    let sub2 = this.moodService.editMood(data).subscribe({
      next: result => {
        this.updateInfo(result);
        this.moodForm.reset();
        this.moodForm.markAsPristine();
        this.iconchange = true;
        this.moodError = false;
        this.changeIcon = false;
        this.successMessage = true;
        setTimeout(() => {
          this.successMessage = false;
        }, 2000);
      },
      error: er => {
        console.log(er);
        this.moodError = true;
        setTimeout(() => {
          this.moodError = false;
        }, 2500);
      }
    });
    this.sub.push(sub2);

  }

  updateInfo(allMoods: any) {
    this.allMoods = allMoods;
    this.existingMoodIcons = allMoods.map((moods: any) => {
      return moods.icon;
    });
  }

  ngOnDestroy(): void {
    if (this.sub.length > 0) {
      this.sub.forEach((subscription) => subscription.unsubscribe());
    }
  }


}
