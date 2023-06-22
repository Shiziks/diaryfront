import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { SharedModule } from '../shared/shared.module';
import { PublicRoutingModule } from './public-routing.module';
import { LandindPageComponent } from './components/landind-page/landind-page.component';
import { LoginRegisterComponent } from './components/login-register/login-register.component';
import { ResetpasswordComponent } from './components/resetpassword/resetpassword.component';
import { PasswordresetformComponent } from './components/passwordresetform/passwordresetform.component';
import { EmailVerifiedComponent } from './components/email-verified/email-verified.component';
import { EmailVerificationErrorComponent } from './components/email-verification-error/email-verification-error.component';



@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    LandindPageComponent,
    LoginRegisterComponent,
    ResetpasswordComponent,
    PasswordresetformComponent,
    EmailVerifiedComponent,
    EmailVerificationErrorComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    PublicRoutingModule,
  ],
  exports: [
    LoginComponent,
    RegisterComponent,
    LandindPageComponent,
    LoginRegisterComponent,
    ResetpasswordComponent,
    PasswordresetformComponent
  ]
})
export class PublicModule { }
