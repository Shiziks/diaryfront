import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { map, } from 'rxjs';
import { AuthStateService } from '../services/auth-state.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate, CanActivateChild {

  x: any;
  constructor(private authState: AuthStateService, private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, tate: RouterStateSnapshot): any {
    let u: any;
    let a: any;
    this.x = this.authState.roleStatus.pipe(map((r => {
      for (let i = 0; i < r.length; i++) {
        if (r[i].role_name == 'admin') {
          a = true;
        }
        else if (r[i].role_name == 'user') {
          u = true;
        }
      }
      if (a) {
        return true;
      }
      else if (u) {
        this.router.navigate(['/profile']);
        return false;

      }
      else {
        this.router.navigate(['/mistake']);
        return false;
      }
    })));
    this.x.subscribe((value: any) => { return value; })
  }


  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.canActivate(childRoute, state);
  }

  ngOnDestroy() {
    this.x.unsubscribe;
  }
}
