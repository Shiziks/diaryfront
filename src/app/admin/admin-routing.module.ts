import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActivityComponent } from './components/activity/activity.component';
import { AdminComponent } from './components/admin/admin.component';
import { AffirmationsComponent } from './components/affirmations/affirmations.component';
import { EnergiesComponent } from './components/energies/energies.component';
import { MakeadminComponent } from './components/makeadmin/makeadmin.component';
import { MoodsComponent } from './components/moods/moods.component';
import ProfileadminsettingsComponent from './components/profileadminsettings/profileadminsettings.component';
import { QuotesComponent } from './components/quotes/quotes.component';
import { SleepComponent } from './components/sleep/sleep.component';
import { WatersComponent } from './components/waters/waters.component';
import { WelcomeImageComponent } from './components/welcome-image/welcome-image.component';

const routes: Routes = [

  {
    path: '',
    component: AdminComponent,
  },
  {
    path: 'admin', component: WelcomeImageComponent
  },
  {
    path: 'quotes', component: QuotesComponent
  },
  {
    path: 'moods', component: MoodsComponent
  },
  {
    path: 'energies', component: EnergiesComponent
  },
  {
    path: 'waters', component: WatersComponent
  },
  {
    path: 'affirmations', component: AffirmationsComponent
  },
  {
    path: 'sleep', component: SleepComponent
  },
  {
    path: 'activity', component: ActivityComponent
  },
  {
    path: 'profileadminsettings', component: ProfileadminsettingsComponent
  },
  {
    path: 'makeadmin', component: MakeadminComponent
  },
  {
    path: 'admin/admin/welcomeimage',
    redirectTo: 'admin/admin',
    pathMatch: 'full'

  },
  {
    path: 'admin/welcomeimage',
    redirectTo: 'admin/admin',
    pathMatch: 'full'

  },

]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }


