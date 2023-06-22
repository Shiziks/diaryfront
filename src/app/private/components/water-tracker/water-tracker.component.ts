import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faGlassWaterDroplet } from '@fortawesome/free-solid-svg-icons';
import { WaterService } from '../../services/water.service';
import { EventEmitter, Output } from '@angular/core';
import { DisableProfileSettingsService } from '../../services/disable-profile-settings.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-water-tracker',
  templateUrl: './water-tracker.component.html',
  styleUrls: ['./water-tracker.component.css']
})
export class WaterTrackerComponent implements OnInit, OnDestroy {

  icon = faGlassWaterDroplet;
  addClass: boolean = false;
  clickedId = 0;
  allWaterGlasses: string[] = [];
  user_id: number = 0;
  waterGlassId: number = 0;
  waterGlassesInfo: any;
  sub: Subscription[] = [];

  @Output() newItemEvent = new EventEmitter<any>();


  constructor(private waterService: WaterService,
    private router: Router,
    private disableSettings: DisableProfileSettingsService
  ) { }

  ngOnInit(): void {
    this.user_id = Number(localStorage.getItem('user_id'));
    let date = new Date().toJSON().slice(0, 10);
    let sub1 = this.waterService.getAllWaterGlasses().subscribe({
      next: result => {
        this.allWaterGlasses = result.data.map((element: any) => {
          return element.glass_number;
        });
        this.waterGlassesInfo = result.data;
      },
      error: er => {
        console.log(er);
      }
    });
    this.sub.push(sub1);

    if (this.user_id != 0) {
      let sub2 = this.waterService.getAllUserWaterLogs(this.user_id).subscribe({
        next: result => {
          let tmp = result.data.filter((element: any) => {
            let elementDate = new Date(element.created_at).toJSON().slice(0, 10);
            if (elementDate == date) {
              return element;
            }
          });

          if (tmp.length != 0) {
            this.waterGlassId = tmp[0].waterglass_id;
            localStorage.setItem('water_info', JSON.stringify(tmp[0]));
          }
          else {
            localStorage.removeItem('water_info');
          }
        }
      });
      this.sub.push(sub2);
    }
  }

  logWaterGlasses(element: any) {
    this.waterGlassId = element.id;
    if (this.waterGlassId > 0 && this.waterGlassId <= 8) {
      let waterGlassName = "";
      this.waterGlassesInfo.forEach((element: any) => {
        if (element.id === this.waterGlassId) {
          waterGlassName = element.glass_number;
        }
      });

      if (localStorage.getItem('water_info')) {
        let tmp = JSON.parse(localStorage.getItem('water_info') || "");
        let id = tmp.id;

        let data = {
          'userwater_id': id,
          'user_id': this.user_id,
          'waterglass_number': waterGlassName
        }

        let sub3 = this.waterService.updateWaterIntake(data).subscribe({
          next: result => {
            localStorage.setItem('water_info', JSON.stringify(result.data));
          },
          error: er => {
            console.log(er);
          }
        });
        this.sub.push(sub3);
      }
      else {
        let data = {
          'user_id': this.user_id,
          'waterglass_number': waterGlassName
        }
        let sub4 = this.waterService.logWaterIntake(data).subscribe({
          next: result => {
            let id = result.data.id;
            if (id) {
              localStorage.setItem('water_info', JSON.stringify(result.data));
            }
          },
          error: er => {
            console.log(er);
          }
        });
        this.sub.push(sub4);
      }
    }
  }


  showIntakes() {
    this.router.navigate(['waterintakeview']);
  }


  disableIt(data: HTMLElement) {
    let name = data.id;
    let dataToSend = {
      'user_id': this.user_id,
      'name': name
    };

    let sub5 = this.disableSettings.disableTheSetting(dataToSend).subscribe({
      next: result => {
        this.newItemEvent.emit(result);
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
