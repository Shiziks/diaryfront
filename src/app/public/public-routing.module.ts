import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotLoggedInService } from '../shared/services/not-logged-in.service';
import { EmailVerificationErrorComponent } from './components/email-verification-error/email-verification-error.component';
import { EmailVerifiedComponent } from './components/email-verified/email-verified.component';
import { LoginRegisterComponent } from './components/login-register/login-register.component';
import { PasswordresetformComponent } from './components/passwordresetform/passwordresetform.component';
import { ResetpasswordComponent } from './components/resetpassword/resetpassword.component';

const routes: Routes = [
  { path: 'login/:role', component: LoginRegisterComponent, canActivate: [NotLoggedInService] },
  { path: 'register', component: LoginRegisterComponent, canActivate: [NotLoggedInService] },
  { path: 'logout', redirectTo: 'login/login', pathMatch: 'full' },
  { path: 'resetpassword', component: ResetpasswordComponent, canActivate: [NotLoggedInService] },
  { path: 'resetpasswordform', component: PasswordresetformComponent, canActivate: [NotLoggedInService] },
  { path: 'admin', redirectTo: 'login/admin', pathMatch: 'full' },
  { path: 'login', redirectTo: 'login/login', pathMatch: 'full' },
  { path: 'emailverified', component: EmailVerifiedComponent, canActivate: [NotLoggedInService] },
  { path: 'emailverificationerror/:email', component: EmailVerificationErrorComponent, canActivate: [NotLoggedInService] }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicRoutingModule { }
