import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterConfigOptions } from '@angular/router';
import { IconName } from '@fortawesome/fontawesome-svg-core';
import { Subscription } from 'rxjs';
import { ProfileSettingsService } from 'src/app/private/services/profile-settings.service';

@Component({
  selector: 'app-profilesettings',
  templateUrl: './profileadminsettings.component.html',
  styleUrls: ['./profileadminsettings.component.css']
})
export default class ProfileadminsettingsComponent implements OnInit, OnDestroy {

  iconActive: IconName = "eye";
  iconDisabled: IconName = "eye-slash";
  categories: any[] = [];
  sub: Subscription[] = [];

  constructor(private profileService: ProfileSettingsService, private router: Router) { }

  ngOnInit(): void {
    let sub1 = this.profileService.getCategories().subscribe({
      next: result => {
        this.categories = result.data;
      },
      error: er => {
        console.log(er);
        this.router.navigate(['/mistake']);
      }
    });
    this.sub.push(sub1);
  }

  disableSetting(element: any) {
    let id = element.id;
    let status = element.admin_status;
    let data = {
      'id': id,
      'admin_status': !status
    }
    let sub2 = this.profileService.changeAdminStatus(data).subscribe({
      next: result => {
        this.categories = result;
      },
      error: er => {
        console.log(er);
      }
    });
    this.sub.push(sub2);
  }

  ngOnDestroy(): void {
    if (this.sub.length > 0) {
      this.sub.forEach((subscription) => subscription.unsubscribe());
    }
  }

}
