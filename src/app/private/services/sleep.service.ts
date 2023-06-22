import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SleepService {

  constructor(private http: HttpClient) { }

  ///GET ALL USER SLEEPING HOURS
  getAllUserSleepingHours(user_id: number): Observable<any> {
    return this.http.get('http://127.0.0.1:8000/api/getallusersleepinghours/' + user_id);
  }

  ///SET SLEEP HOURS
  setSleepHours(userSleep: any): Observable<any> {
    return this.http.post('http://127.0.0.1:8000/api/setusersleep', userSleep);
  }

  ///UPDATE USER SLEEP HOURS
  updateUserSleep(userSleep: any): Observable<any> {
    return this.http.post('http://127.0.0.1:8000/api/updatesleephours', userSleep);
  }

  ///GET CURRENT SLEEPING HOURS
  getCurrentSleepingHours(id: any): Observable<any> {
    return this.http.get('http://127.0.0.1:8000/api/getcurrentsleepingtime/' + id);
  }

  /////GET SLEEP HOURS
  getSleepHours(): Observable<any> {
    return this.http.get('http://127.0.0.1:8000/api/getsleephours');
  }

  ////EDIT SLEEP HOUR
  editSleepHour(data: any): Observable<any> {
    return this.http.post('http://127.0.0.1:8000/api/editsleephour', data);
  }
}
