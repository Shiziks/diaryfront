import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './components/admin/admin.component';
import { SharedModule } from '../shared/shared.module';
import { WelcomeImageComponent } from './components/welcome-image/welcome-image.component';
import { QuotesComponent } from './components/quotes/quotes.component';
import { MoodsComponent } from './components/moods/moods.component';
import { EnergiesComponent } from './components/energies/energies.component';
import { WatersComponent } from './components/waters/waters.component';
import { AffirmationsComponent } from './components/affirmations/affirmations.component';
import { SleepComponent } from './components/sleep/sleep.component';
import { ActivityComponent } from './components/activity/activity.component';
import ProfileadminsettingsComponent from './components/profileadminsettings/profileadminsettings.component';
import { MakeadminComponent } from './components/makeadmin/makeadmin.component';


@NgModule({
  declarations: [
    AdminComponent,
    WelcomeImageComponent,
    QuotesComponent,
    MoodsComponent,
    EnergiesComponent,
    WatersComponent,
    AffirmationsComponent,
    SleepComponent,
    ActivityComponent,
    ProfileadminsettingsComponent,
    MakeadminComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    SharedModule
  ],
  exports: [
    AdminComponent
  ]
})
export class AdminModule { }
