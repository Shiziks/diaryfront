import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  private issuer = {
    login: 'http://127.0.0.1:8000/api/login',
    register: 'http://127.0.0.1:8000/api/register',
    refresh: 'http://127.0.0.1:8000/api/refresh'
  }

  tokenValid: any;

  constructor(
    private router: Router
  ) { }

  setToken(token: any, expires?: any) {
    console.log("USAO U TOKEN SERVICE");
    localStorage.setItem('auth_token', token);
    localStorage.setItem('expires', expires);
  }

  getToken(): string {
    let token = localStorage.getItem('auth_token');

    if (token !== 'false' && token !== 'undefined' && token) {
      return String(localStorage.getItem('auth_token'));
    }
    else {
      return '';
    }
  }

  payload(token: any) {
    if (token !== false || token !== undefined) {
      const jwtPayload = token.split('.')[1];
      let decode = this.isEncoded(jwtPayload);
      if (decode) {
        let tmp = window.atob(jwtPayload);
        let x = JSON.parse(tmp);
        return x;
      }
    }
    return;
  }

  isValidToken(token?: string) {
    let t;
    if (token) {
      t = token;
    }
    else {
      t = this.getToken();
    }

    if (t) {
      const payload = this.payload(t);
      if (payload) {
        let x = Object["values"](this.issuer).indexOf(payload.iss) > -1 ? true : false;
        return x;
      }
      else {
        return false;
      }
    }
    else {
      return false;
    }
  }

  isLoggedIn() {
    this.tokenValid = this.isValidToken();
    return this.tokenValid;;
  }

  removeToken() {
    localStorage.clear();
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
}
