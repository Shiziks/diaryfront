import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { SharedModule } from '../shared/shared.module';
import { PrivateRoutingModule } from './private-routing.module';
import { ProfileSettingsComponent } from './components/profile-settings/profile-settings.component';
import { MoodLogComponent } from './components/mood-log/mood-log.component';
import { EnergyLogComponent } from './components/energy-log/energy-log.component';
import { LogComponent } from './components/log/log.component';
import { PostFormComponent } from './components/post-form/post-form.component';
import { DayLogComponent } from './components/day-log/day-log.component';
import { GratitudeLogComponent } from './components/gratitude-log/gratitude-log.component';
import { TrackerComponent } from './components/tracker/tracker.component';
import { SleepTrackerComponent } from './components/sleep-tracker/sleep-tracker.component';
import { FilterComponent } from './components/filter/filter.component';
import { DayLogViewComponent } from './components/day-log-view/day-log-view.component';
import { AutosizeModule } from 'ngx-autosize';
import { ImagemodalComponent } from './components/imagemodal/imagemodal.component';
import { GratitudesViewComponent } from './components/gratitudes-view/gratitudes-view.component';
import { NgxPaginationModule } from "ngx-pagination";
import { AffirmationComponent } from './components/affirmation/affirmation.component';
import { MoodsViewComponent } from './components/moods-view/moods-view.component';
import { NgChartsModule, NgChartsConfiguration } from 'ng2-charts';
import { EnergyViewComponent } from './components/energy-view/energy-view.component';
import { WaterTrackerComponent } from './components/water-tracker/water-tracker.component';
import { WaterintakeViewComponent } from './components/waterintake-view/waterintake-view.component';
import { ChartsModule } from './chartsmodule/charts.module';
import { SleepViewComponent } from './components/sleep-view/sleep-view.component';
import { ActivityLogComponent } from './components/activity-log/activity-log.component';
import { ActivityViewComponent } from './components/activity-view/activity-view.component';
import { ProfileInfoComponent } from './components/profile-info/profile-info.component';
import { ProfileViewComponent } from './components/profile-view/profile-view.component';
import { ProfilePasswordResetComponent } from './components/profile-password-reset/profile-password-reset.component';
import { ProfileImageComponent } from './components/profile-image/profile-image.component';
import { ProfileTestemonialComponent } from './components/profile-testemonial/profile-testemonial.component';


@NgModule({
  declarations: [
    UserProfileComponent,
    ProfileSettingsComponent,
    MoodLogComponent,
    EnergyLogComponent,
    LogComponent,
    PostFormComponent,
    DayLogComponent,
    GratitudeLogComponent,
    TrackerComponent,
    SleepTrackerComponent,
    FilterComponent,
    DayLogViewComponent,
    ImagemodalComponent,
    GratitudesViewComponent,
    AffirmationComponent,
    MoodsViewComponent,
    EnergyViewComponent,
    WaterTrackerComponent,
    WaterintakeViewComponent,
    SleepViewComponent,
    ActivityLogComponent,
    ActivityViewComponent,
    ProfileInfoComponent,
    ProfileViewComponent,
    ProfilePasswordResetComponent,
    ProfileImageComponent,
    ProfileTestemonialComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    PrivateRoutingModule,
    AutosizeModule,
    NgxPaginationModule,
    NgChartsModule,
    ChartsModule,
  ],
  exports: [
    UserProfileComponent,
    AutosizeModule
  ],
  providers: [
    { provide: NgChartsConfiguration, useValue: { generateColors: false } }
  ]
})
export class PrivateModule { }
