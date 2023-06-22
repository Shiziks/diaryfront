import { Component, OnInit, } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthStateService } from 'src/app/shared/services/auth-state.service';
import { AuthService } from '../../services/auth.service';
import { EmitFromNavigationService } from '../../services/emit-from-navigation.service';
import { TokenService } from '../../services/token.service';
import { Location, } from '@angular/common';


@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {

  link: string = '';
  title: string = 'Diary';
  roles: any;
  admin: boolean = false;
  user: boolean = false;

  isAuth: boolean = false;
  token: any;
  sub: Subscription[] = [];


  constructor(
    private router: Router,
    public tokenService: TokenService,
    private authService: AuthService,
    private authStateService: AuthStateService,
    private emitFromNavigation: EmitFromNavigationService,
    private location: Location
  ) { }


  ngOnInit(): void {
    this.checkAuth();
    this.checkRoles();
  }


  logout() {
    this.tokenService.removeToken();
    this.link = '/home';
    this.authStateService.changeAuthState();
    this.authStateService.setLogedInValue(false);
    this.router.navigate(['logout']);

  }

  checkAuth() {
    let sub1 = this.authStateService.authStatus.subscribe((value: any) => this.isAuth = value);
    if (this.isAuth) {
      if (this.admin) {
        this.link = '/admin/admin';
      }
      else {
        this.link = '/profile';
      }
    }
    else {
      //console.log("DOsao sam na dobro");
      this.link = '/home';
    }
    this.sub.push(sub1);
  }

  checkRoles() {
    let sub2 = this.authStateService.roleStatus.subscribe((value: any) => {
      this.roles = value;
      if (this.roles != null && this.roles.length > 0) {
        this.admin = this.roleExists(this.roles, 'admin');
        this.user = this.roleExists(this.roles, 'user');
      }

    });
    this.sub.push(sub2);
  }

  loginClick() {
    let url = this.router.url;
    let path = this.location.path();
    if ((url === '/login/login' && path === '/register') || (url === '/register' && path === '/register')) {
      this.emitFromNavigation.callShowLoginMethod();
    }
    else if (url !== '/login/login' && url !== '/register') {
      this.router.navigate(['/login/login']);
    }

  }

  registerClick() {
    let url = this.router.url;
    let path = this.location.path();
    if ((url === '/register' && path === '/login/login') || (url === '/login/login' && path === '/login/login')) {
      this.emitFromNavigation.callShowRegisterMethid();
    }
    else if (url !== '/login/login' && url !== '/register') {
      this.router.navigate(['/register']);
    }
  }

  roleExists(roles: any, rolecheck: any) {
    return roles.some((role: any) => {
      return role.role_name === rolecheck;
    });
  }

  ngOnDestroy() {
    this.sub.forEach((subscription) => subscription.unsubscribe());
  }
}
