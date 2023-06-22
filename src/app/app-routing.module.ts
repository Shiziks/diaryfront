import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './shared/interceptors/auth.interceptor';
import { MistakeComponent } from './shared/components/mistake/mistake.component';
import { LandindPageComponent } from './public/components/landind-page/landind-page.component';
import { AdminComponent } from './admin/components/admin/admin.component';
import { AuthGuard } from './shared/guards/auth.guard';
import { RoleGuard } from './shared/guards/role.guard';
import { UserProfileComponent } from './private/components/user-profile/user-profile.component';
import { UserRoleGuard } from './shared/guards/user-role.guard';
import { ResolveGratitudeService } from './private/services/resolve-gratitude.service';


const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: LandindPageComponent },
  { path: 'mistake', component: MistakeComponent },
  {
    path: 'admin', component: AdminComponent, canLoad: [AuthGuard],
    canActivate: [RoleGuard],
    canActivateChild: [AuthGuard, RoleGuard],
    loadChildren: () => import('./admin/admin.module').then(x => x.AdminModule)
  },
  {
    path: 'profile', component: UserProfileComponent,
    canLoad: [AuthGuard],
    canActivate: [UserRoleGuard],
    canActivateChild: [AuthGuard],
    resolve: {
      currentGratitudes: ResolveGratitudeService
    },
    loadChildren: () => import('./private/private.module').then(x => x.PrivateModule)
  },

];

@NgModule({
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'enabled'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
