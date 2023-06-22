import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { faPen, IconName } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { WaterService } from 'src/app/private/services/water.service';

@Component({
  selector: 'app-waters',
  templateUrl: './waters.component.html',
  styleUrls: ['./waters.component.css']
})
export class WatersComponent implements OnInit {

  subtitle: string = "Number of water glasses:";
  subtitle1: string = "Edit water glasses and icons:";
  faPen = faPen;
  waterError: boolean = false;
  id: number = 0;
  waterIcons: IconName[] = ['glass-water', 'droplet', 'glass-water-droplet', 'glass-cheers', 'glass-whiskey', 'wine-glass', 'bottle-water', 'bottle-droplet'];

  allWaters: any;
  waterForm!: FormGroup;
  currentIcon: IconName[] = [];
  showIcons: boolean = false;
  iconChanged: boolean = false;
  pickedIcon!: IconName;
  waterGlassId: number = 0;
  successMessage: boolean = false;
  regExWater: string = '^[a-z]{1,9}$';
  sub: Subscription[] = [];

  constructor(private waterService: WaterService) {
    this.waterForm = new FormGroup({
      waterTs: new FormControl("", [Validators.required, Validators.minLength(2), Validators.maxLength(15), Validators.pattern(this.regExWater)]),
    });
  }

  ngOnInit(): void {
    let sub1 = this.waterService.getAllWaterGlasses().subscribe({
      next: result => {
        this.allWaters = result.data;
        this.currentIcon = result.data.map((waterglass: any) => {
          return waterglass.icon;
        });
        this.waterError = false;
        let x = this.allEqual(this.currentIcon);
        if (x) {
          this.currentIcon = [this.currentIcon[0]];
          this.id = this.waterIcons.indexOf(this.currentIcon[0]);
        }
      },
      error: er => {
        console.log(er);
        this.waterError = true;
      }
    });
    this.sub.push(sub1);
  }

  editWater(element: HTMLElement) {
    this.waterForm.markAsPristine();
    this.iconChanged = false;
    this.showIcons = true;
    this.waterGlassId = Number(element.id);
    let waterNumber = element.innerHTML;
    this.waterForm.patchValue({
      waterTs: waterNumber
    })
  }

  deleteWater(elelemnt: HTMLElement) {

  }

  saveChanges() {
    let data;
    if (this.pickedIcon) {
      data = {
        'id': this.waterGlassId,
        'glass_number': this.waterForm.get('waterTs')?.value,
        'icon': this.pickedIcon
      }
    }
    else {
      data = {
        'id': this.waterGlassId,
        'glass_number': this.waterForm.get('waterTs')?.value,
      }
    }

    let sub2 = this.waterService.editWaterGlasses(data).subscribe({
      next: result => {
        this.allWaters = result;
        this.waterForm.reset();
        this.waterForm.markAsPristine;
        this.iconChanged = false;
        this.successMessage = true;
        this.showIcons = false;
        this.currentIcon = result.map((waterglass: any) => {
          return waterglass.icon;
        });
        let x = this.allEqual(this.currentIcon);
        if (x) {
          this.currentIcon = [this.currentIcon[0]];
          this.id = this.waterIcons.indexOf(this.currentIcon[0]);
        }
        setTimeout(() => {
          this.successMessage = false;
        }, 2000)
      },
      error: er => {
        console.log(er);
        this.waterError = true;
        setTimeout(() => {
          this.waterError = false;
        }, 2000);
      }
    });
    this.sub.push(sub2);
  }

  pickNewIcon(icon: any, id: any) {
    this.iconChanged = true;
    this.id = id;
    this.pickedIcon = icon;
  }

  allEqual(array: any[]) {
    return array.every((val, i, arr) => val === arr[0]);
  }

  ngOnDestroy() {
    if (this.sub.length > 0) {
      this.sub.forEach((subscription) => subscription.unsubscribe());
    }
  }

}
