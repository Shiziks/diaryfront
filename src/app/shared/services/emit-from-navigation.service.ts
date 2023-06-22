import { Injectable } from '@angular/core';
import { BehaviorSubject, } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmitFromNavigationService {

  private showLogin$ = new BehaviorSubject<any>({});
  callShowLogin$ = this.showLogin$.asObservable();

  private showRegister$ = new BehaviorSubject<any>({});
  callShowRegister$ = this.showRegister$.asObservable();

  constructor() {

  }

  callShowLoginMethod() {
    this.showLogin$.next(true);
  }

  callShowRegisterMethid() {
    this.showRegister$.next(true);
  }
}
