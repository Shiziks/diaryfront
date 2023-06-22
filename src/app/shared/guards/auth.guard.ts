import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router, CanActivateChild, CanLoad, Route, UrlSegment } from '@angular/router';
import { AuthStateService } from '../services/auth-state.service';
import { AuthService } from '../services/auth.service';
import { TokenService } from '../services/token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild, CanLoad {

  x: any;

  constructor(
    private authService: AuthService,
    private router: Router,
    private tokenService: TokenService,
    private authState: AuthStateService
  ) { }

  canActivate(next?: ActivatedRouteSnapshot, state?: RouterStateSnapshot): boolean {
    this.x = this.authState.getAuthStatus();
    if (this.x === true) {
      return true;
    }
    else {
      this.tokenService.removeToken();
      this.authService.logout();
      this.authState.setAuthState(false);
      this.authState.setLogedInValue(false);
      this.router.navigate(['/login']);
      return false;
    }
  }

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.canActivate(childRoute, state);
  }

  canLoad(route: Route, segments: UrlSegment[]): boolean {
    return this.canActivate();
  }
}
