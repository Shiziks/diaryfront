import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivityService } from 'src/app/private/services/activity.service';
import { ProfileSettingsService } from 'src/app/private/services/profile-settings.service';

@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.css']
})
export class ActivityComponent implements OnInit, OnDestroy {

  subtitle: string = 'Manage activity view:';
  error: boolean = false;
  activity: any;
  subcategories: any;
  changed1: any = null;
  changed2: any = null;
  id1: number = 0;
  id2: number = 0;
  message: string = '';
  status1: any = null;
  status2: any = null;
  dataToSend1: any = null;
  dataToSend2: any = null;
  sub: Subscription[] = [];


  constructor(private activityService: ActivityService, private profileService: ProfileSettingsService) { }

  ngOnInit(): void {
    this.getSubcategories('activity');
  }

  OnChange(value: any, event: any) {
    if (this.id1 == 0 || this.id1 == value) {
      this.id1 = value;
      this.status1 = event.target.checked; //novi status
      this.subcategories.forEach((sub: any) => {
        if (sub.id == this.id1 && sub.admin_status == this.status1) {
          this.changed1 = null;
          this.dataToSend1 = null;
        }
        else if (sub.id == this.id1 && sub.admin_status != this.status1) {
          this.changed1 = true;
          this.dataToSend1 = {
            'id': this.id1,
            'status': this.status1
          }
        }
      });
    }
    else if (this.id2 == 0 || this.id2 == value) {
      this.id2 = value;
      this.status2 = event.target.checked;
      this.subcategories.forEach((sub: any) => {
        if (sub.id == this.id2 && sub.admin_status == this.status2) {
          this.changed2 = null;
          this.dataToSend2 = null;
        }
        else if (sub.id == this.id2 && sub.admin_status != this.status2) {
          this.changed2 = true;
          this.dataToSend2 = {
            'id': this.id2,
            'status': this.status2
          }
        }
      });
    }

  }

  getSubcategories(value: number | string) {
    let sub1 = this.activityService.getCatSubcategories(value).subscribe({
      next: result => {
        this.subcategories = result;
      },
      error: er => {
        console.log(er);
      }
    });

    this.sub.push(sub1);
  }

  saveAdminStatus() {
    let dataToSend: { data1?: any; data2?: any } = {};
    if (this.dataToSend1) {
      dataToSend.data1 = this.dataToSend1;
    }
    if (this.dataToSend2) {
      dataToSend.data2 = this.dataToSend2;
    }


    let sub2 = this.activityService.changeAdminStatus(dataToSend).subscribe({
      next: result => {
        this.changed1 = null;
        this.changed2 = null;
        this.message = "Status changed."
        setTimeout(() => {
          this.message = '';
        }, 2500);
      },
      error: er => {
        console.log(er);
        this.message = "Oooops!!! We ran into a problem. Please try later.";
        setTimeout(() => {
          this.message = '';
        }, 2500);
      },
      complete: () => {
        this.getSubcategories('activity');
      }
    });
    this.sub.push(sub2);
  }

  ngOnDestroy() {
    if (this.sub.length > 0) {
      this.sub.forEach((subscription) => subscription.unsubscribe());
    }
  }

}
