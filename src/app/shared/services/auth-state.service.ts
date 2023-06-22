import { Injectable } from '@angular/core';
import { BehaviorSubject, } from 'rxjs';
import { TokenService } from './token.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthStateService {

  private loggedIn = new BehaviorSubject<boolean>(this.getAuthStatus());
  authStatus = this.loggedIn.asObservable();

  private roles = new BehaviorSubject<any>(this.getRoles());
  roleStatus = this.roles.asObservable();

  constructor(private authService: AuthService, private tokenService: TokenService) { }


  private logedInState: any;
  private existingRoles: any;

  setLogedInValue(value: boolean) {
    this.logedInState = value;

  }

  getLoggedInValue(): boolean {
    return this.logedInState;
  }

  changeAuthState(token?: string): any {
    let t;
    if (token) {
      t = this.getAuthStatus(token);
    }
    else {
      t = this.getAuthStatus();
    }
    if (t) {
      this.setAuthState(true);
      return true;
    }
    else {
      this.setAuthState(false);
      return false;
    }
  }

  setAuthState(state: boolean): boolean {
    this.loggedIn.next(state);
    return state;
  }

  getAuthStatus(token?: string) {
    let t;
    if (token) {
      t = this.tokenService.isValidToken(token);
    }
    else {
      t = this.tokenService.isValidToken();
    }

    if (t) {
      return true;
    }
    else {
      return false;
    }
  }

  getExpiration(token?: string) {
    let t;
    let timeNow = Math.floor((new Date).getTime() / 1000);
    if (token) {
      t = token;
    }
    else {
      t = localStorage.getItem('auth_token');
      if (t === 'undefined' || t === 'false') {
        t = false;
      }
    }

    if (t) {
      const jwtPayload = String(t).split('.')[1];
      let tmp = this.isEncoded(jwtPayload);
      if (tmp) {
        let decoded = window.atob(jwtPayload);
        let expiresAt = JSON.parse(decoded).exp;
        return expiresAt;
      }
      else {
        return timeNow - 1000;
      }
    }
    else {
      return timeNow - 1000;
    }
  }

  isEncoded(token: string): boolean {
    try {
      window.atob(token);
      return true;
    }
    catch (e) {
      return false;
    }
  }

  setRoles(rolesExist: any) {
    this.roles.next(rolesExist);
    this.existingRoles = rolesExist;
  }

  getRoles() {
    if (!this.existingRoles) {
      this.existingRoles = JSON.parse(localStorage.getItem('user_roles') || 'null')
    }
    return this.existingRoles;
  }
}

