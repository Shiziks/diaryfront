import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpInterceptor,
} from '@angular/common/http';
import { BehaviorSubject, catchError, filter, switchMap, take, throwError } from 'rxjs';
import { TokenService } from '../services/token.service';
import { AuthService } from '../services/auth.service';
import { AuthStateService } from '../services/auth-state.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  private refreshingInProgress = false;
    // Refresh Token Subject tracks the current token, or is null if no token is currently
    // available (e.g. refresh pending).
  private refreshTokenSubject = new BehaviorSubject(null);
  token?:string;


  constructor(private tokenService: TokenService, 
    private authService:AuthService, 
    private authState:AuthStateService,
    private router: Router) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): any {
    if (request.url.indexOf('refresh') !== -1) {
      return next.handle(this.addToken(request));
    }
    let token =this.tokenService.getToken();
    if(token!=''){
      let expires=this.authState.getExpiration();
      let timeNow=Math.floor((new Date).getTime() / 1000);
      if(timeNow>=expires){
        if(!this.refreshingInProgress){
          this.refreshingInProgress=true;
          this.refreshTokenSubject.next(null);
          return this.authService.refresh(this.tokenService.getToken()).pipe(switchMap((token: any) => {
            this.refreshingInProgress = false;
              let ttl=this.authState.getExpiration(token.auth.token);
              this.authState.changeAuthState(token.auth.token);
              this.tokenService.setToken(token.auth.token, ttl);
              this.refreshTokenSubject.next(token.auth.token);
              return next.handle(this.addToken(request));
          }), catchError((err: any) => {
            console.log(err);
              this.refreshingInProgress=false;
              this.authService.logout();
              this.authState.setAuthState(false);
              this.authState.setLogedInValue(false);
              this.tokenService.removeToken();
              this.router.navigate(['/login']);
              return throwError(() => err);
          }));
        }
        else {
          return this.refreshTokenSubject.pipe(
              filter(result => result !== null),
              take(1),
              switchMap((res) => {
                  return next.handle(this.addToken(request));
              })
          );
        }
      }
      else{
        return next.handle(this.addToken(request));
      }
    }
  else {
    return next.handle(this.addToken(request));
  }
}
 

  addToken(request: HttpRequest<any>) {
    const token = this.tokenService.getToken();
    let valid=this.tokenService.isValidToken(token);

    if (token==null || token==='undefined' || token==='false' || token==='' ||!valid) {
      return request;
    }
    else{
      return request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }
  }
}


