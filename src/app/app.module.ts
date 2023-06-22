import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './shared/shared.module';
import { PublicModule } from './public/public.module';
import { PrivateModule } from './private/private.module';

import { AuthInterceptor } from './shared/interceptors/auth.interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { NgChartsModule } from 'ng2-charts';

import {
  faFaceGrimace, faFaceGrin, faFaceLaugh, faFaceGrinBeam, faFaceGrinHearts,
  faFaceGrinStars, faFaceGrinTears, faFaceAngry, faFaceDizzy,
  faFaceFlushed, faFaceFrown, faFaceFrownOpen, faFaceGrinBeamSweat, faFaceGrinSquint,
  faFaceGrinWide, faFaceGrinWink, faFaceLaughBeam, faFaceLaughWink, faFaceMeh, faFaceMehBlank,
  faFaceRollingEyes, faFaceSadCry, faFaceSmile, faFaceSadTear, faFaceSmileBeam, faFaceSmileWink, faFaceTired,
  faFaceSurprise, faFaceLaughSquint, faFaceKissWinkHeart, faSquare, faFilm, faStar, faStarHalf, faStarHalfAlt, faStarHalfStroke, faEyeSlash, faEye,
  faCircleCheck, faCircleRight, faPen, faCircleXmark, faArrowLeftLong
} from '@fortawesome/free-solid-svg-icons';

import { faBatteryFull, faBatteryThreeQuarters, faBatteryHalf, faBatteryQuarter, faBatteryEmpty } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarOutline, faStarHalf as starHalfOutline, faPaperPlane } from '@fortawesome/free-regular-svg-icons';
import { faGlassWater, faDroplet, faGlassWaterDroplet, faGlassCheers, faGlassWhiskey, faGlassMartini, faWineGlass, faBottleWater, faBottleDroplet } from '@fortawesome/free-solid-svg-icons';
import { NotFoundModule } from './not-found/not-found.module';


@NgModule({
  declarations: [
    AppComponent,

  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    SharedModule,
    PublicModule,
    PrivateModule,
    CommonModule,
    FontAwesomeModule,
    NgChartsModule,
    AppRoutingModule,
    NotFoundModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

  constructor(private library: FaIconLibrary) {
    library.addIcons(faFaceGrimace, faFaceGrin, faFaceLaugh, faFaceGrinBeam, faFaceGrinHearts,
      faFaceGrinStars, faFaceGrinTears, faFaceAngry, faFaceDizzy,
      faFaceFlushed, faFaceFrown, faFaceFrownOpen, faFaceGrinBeamSweat, faFaceGrinSquint,
      faFaceGrinWide, faFaceGrinWink, faFaceLaughBeam, faFaceLaughWink, faFaceMeh, faFaceMehBlank,
      faFaceRollingEyes, faFaceSadCry, faFaceSmile, faFaceSadTear, faFaceSmileBeam, faFaceSmileWink, faFaceTired,
      faFaceSurprise, faFaceLaughSquint, faFaceKissWinkHeart, faSquare,
      faBatteryFull, faBatteryThreeQuarters, faBatteryHalf, faBatteryQuarter, faBatteryEmpty,
      faStar, faStarHalf, faStarHalfAlt, faStarHalfStroke, faStarOutline, starHalfOutline,
      faGlassWater, faDroplet, faGlassWaterDroplet, faGlassCheers, faGlassWhiskey, faGlassMartini, faWineGlass, faBottleWater, faBottleDroplet,
      faEye, faEyeSlash, faCircleCheck, faCircleRight, faPen, faPaperPlane, faCircleXmark, faArrowLeftLong,
    );
  }

}

