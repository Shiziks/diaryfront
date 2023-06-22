import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../shared/guards/auth.guard';
import { UserRoleGuard } from '../shared/guards/user-role.guard';
import { ActivityViewComponent } from './components/activity-view/activity-view.component';
import { DayLogViewComponent } from './components/day-log-view/day-log-view.component';
import { EnergyViewComponent } from './components/energy-view/energy-view.component';
import { MoodsViewComponent } from './components/moods-view/moods-view.component';
import { ProfileSettingsComponent } from './components/profile-settings/profile-settings.component';
import { SleepViewComponent } from './components/sleep-view/sleep-view.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { WaterintakeViewComponent } from './components/waterintake-view/waterintake-view.component';
import { ResolveGratitudeService } from './services/resolve-gratitude.service';


const routes: Routes = [
  {
    path: 'profile',
    component: UserProfileComponent,
    // path: 'profile', 
    //component: UserProfileComponent, 
    canActivate: [AuthGuard, UserRoleGuard],
    canActivateChild:[AuthGuard],
    resolve: {
    currentGratitudes : ResolveGratitudeService
    },
    // children: [
    //   // {
    //   //   path: "settings",
    //   //   component: ProfileSettingsComponent
    //   // }
    // ]
  },
  {
    path: 'quote',
    redirectTo: '/profile',
    pathMatch: 'full'
  },
  {
    path: 'profile/daylog',
    component: DayLogViewComponent,
    canActivate: [AuthGuard, UserRoleGuard]
  },
  {
    path: 'moodsview',
    component: MoodsViewComponent,
    canActivate: [AuthGuard, UserRoleGuard]
  },
  {
    path: "profile/settings",
    component: ProfileSettingsComponent,
    canActivate: [AuthGuard, UserRoleGuard]
  },
  {
    path: 'energyviews',
    component: EnergyViewComponent,
    canActivate: [AuthGuard, UserRoleGuard]
  },
  {
    path: 'waterintakeview',
    component: WaterintakeViewComponent,
    canActivate: [AuthGuard, UserRoleGuard]
  },
  {
    path: 'sleepinghoursview',
    component: SleepViewComponent,
    canActivate: [AuthGuard, UserRoleGuard]
  },
  {
    path: 'activityview',
    component: ActivityViewComponent,
    canActivate: [AuthGuard, UserRoleGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrivateRoutingModule { }
