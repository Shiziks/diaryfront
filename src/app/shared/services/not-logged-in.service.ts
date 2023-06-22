import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AuthStateService } from './auth-state.service';

@Injectable({
  providedIn: 'root'
})
export class NotLoggedInService implements CanActivate {

  constructor(private authstate: AuthStateService, private router: Router) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    let x = this.authstate.getAuthStatus();
    if (x) {
      this.router.navigate(['profile']);
      return false;
    }
    else return true;
  }
}
