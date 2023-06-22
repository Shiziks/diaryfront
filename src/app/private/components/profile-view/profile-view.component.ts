import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DisableProfileSettingsService } from '../../services/disable-profile-settings.service';
import { ProfileSettingsService } from '../../services/profile-settings.service';

@Component({
  selector: 'app-profile-view',
  templateUrl: './profile-view.component.html',
  styleUrls: ['./profile-view.component.css']
})
export class ProfileViewComponent implements OnInit, OnDestroy {

  user_id: number = 0;
  allSettings: any;
  sub: Subscription[] = [];

  constructor(private settingsService: ProfileSettingsService,
    private disableSettings: DisableProfileSettingsService) { }

  ngOnInit(): void {
    this.user_id = Number(localStorage.getItem('user_id'));

    let sub1 = this.settingsService.getSettings(this.user_id).subscribe({
      next: result => {
        this.allSettings = result.data;
      },
      error: er => {
        console.log(er.message);
      }
    });
    this.sub.push(sub1);
  }

  //////FUNKCIJA ZA ISKLJUCIVANJE OPCIJA
  turnItOff(event: any): void {

    let value = event.target.value;
    let checked = event.target.checked ? 1 : 0;
    let dataToSend = {
      'status': checked,
      'name': value,
      'user_id': this.user_id
    };

    let sub2 = this.disableSettings.disableTheSetting(dataToSend).subscribe({
      next: result => {
      },
      error: er => {
        console.log(er.message);
      }
    });
    this.sub.push(sub2);
    this.settingsService.setSettings(dataToSend);
  }

  ngOnDestroy() {
    if (this.sub.length > 0) {
      this.sub.forEach((subscription) => subscription.unsubscribe());
    }
  }
}
