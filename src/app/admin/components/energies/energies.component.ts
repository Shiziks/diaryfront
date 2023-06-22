import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { faPen, IconName } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { EnergiesService } from 'src/app/private/services/energies.service';

@Component({
  selector: 'app-energies',
  templateUrl: './energies.component.html',
  styleUrls: ['./energies.component.css']
})
export class EnergiesComponent implements OnInit, OnDestroy {

  subtitle: string = "All energies:";
  subtitle1 = "Edit energy and icon:";
  faPen = faPen;
  id: number = 0;
  energyError: boolean = false;
  allEnergies: any;
  showIcons: boolean = false;
  currentIcons: IconName[] = [];
  currentIconSet: number = 0;
  successMessage: boolean = false;
  pickedIcons: any;
  activeIcons: number = 0;
  iconsChanged: boolean = false;
  currentEnergyName: string = '';
  iconChange: boolean = false;
  sub: Subscription[] = [];

  starIcons: any = [
    {
      icon_prefix: 'fas',
      iconName: 'star'
    },
    {
      icon_prefix: 'fas',
      iconName: 'star-half-stroke'
    },
    {
      icon_prefix: 'fas',
      iconName: 'star-half'
    },
    {
      icon_prefix: 'far',
      iconName: 'star'
    },
    {
      icon_prefix: 'far',
      iconName: 'star-half'
    }
  ];

  batteryIcons: any = [
    {
      icon_prefix: 'fas',
      iconName: 'battery-full'
    },
    {
      icon_prefix: 'fas',
      iconName: 'battery-three-quarters'
    },
    {
      icon_prefix: 'fas',
      iconName: 'battery-half'
    },
    {
      icon_prefix: 'fas',
      iconName: 'battery-quarter'
    },
    {
      icon_prefix: 'fas',
      iconName: 'battery-empty'
    }
  ];

  energyForm!: FormGroup;
  regExEnergy: string = '^[a-z]{1,9}$';

  constructor(private energyService: EnergiesService) {
    this.energyForm = new FormGroup({
      energyTs: new FormControl("", [Validators.required, Validators.minLength(2), Validators.maxLength(10), Validators.pattern(this.regExEnergy)]),
    });
  }

  ngOnInit(): void {
    let sub1 = this.energyService.getEnergies().subscribe({
      next: result => {
        this.allEnergies = result.data;
        this.currentIcons = result.data.map((energy: any) => {
          return energy.icon;
        });
        if (this.currentIcons.includes(this.batteryIcons[0].iconName)) {
          this.activeIcons = 1;
          this.currentIconSet = this.batteryIcons;
        }
        else {
          this.activeIcons = 2;
          this.currentIconSet = this.starIcons;
        }
      },
      error: er => {
        console.log(er);
        this.energyError = true;
      }
    });
    this.sub.push(sub1);
  }

  editEnergy(element: HTMLElement) {
    this.energyForm.reset();
    this.energyForm.markAsPristine();
    this.showIcons = true;
    this.id = Number(element.id);
    this.currentEnergyName = element.innerHTML;
    this.energyForm.patchValue({
      energyTs: this.currentEnergyName
    });

  }

  saveChanges() {
    let arrayToSend: any[] = [];

    if (this.iconChange) {
      this.allEnergies.forEach((element: any, index: any) => {
        arrayToSend[index] = {
          'id': element.id,
          'icon': this.pickedIcons[index]
        }
      });
    }
    let data;
    let energy_name = this.energyForm.get('energyTs')?.value;

    if (this.iconChange && this.currentEnergyName === energy_name) {
      data = {
        'icons': arrayToSend
      }
    }
    else if (!this.iconChange && this.currentEnergyName != energy_name) {
      data = {
        'id': this.id,
        'energy_name': energy_name
      }
    }
    else {
      data = {
        'icons': arrayToSend,
        'id': this.id,
        'energy_name': energy_name
      }
    }

    let sub2 = this.energyService.editEnergy(data).subscribe({
      next: result => {
        this.activeIcons == 1 ? this.activeIcons = 2 : this.activeIcons = 1;
        this.energyForm.reset();
        this.allEnergies = result;
        this.energyError = false;
        this.showIcons = false;
        this.successMessage = true;
        setTimeout(() => {
          this.successMessage = false
        }, 2000);
      },
      error: er => {
        console.log(er);
        this.energyError = true;
        setTimeout(() => {
          this.energyError = false;
        }, 2000)
      }
    });
    this.sub.push(sub2);
  }

  pickNewIcon(icons: any) {
    if (this.activeIcons == 1 && icons == 2) {
      this.pickedIcons = this.starIcons;
      this.iconChange = true;

    }
    else if (this.activeIcons == 2 && icons == 1) {
      this.pickedIcons = this.batteryIcons;
      this.iconChange = true;
    }
    else {
      this.iconChange = false;
    }
  }

  ngOnDestroy(): void {
    if (this.sub.length > 0) {
      this.sub.forEach((subscription) => subscription.unsubscribe());
    }
  }

}
