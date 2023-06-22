import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LogService {


  constructor(private http: HttpClient) { }

  logMood(userMood: any): Observable<any> {
    return this.http.post('http://127.0.0.1:8000/api/usermood', userMood);
  }

  updateMood(userMood: any): Observable<any> {
    return this.http.post('http://127.0.0.1:8000/api/usermoodupdate', userMood);
  }

  getMoods(): Observable<any> {
    return this.http.get('http://127.0.0.1:8000/api/moods');
  }

  getCurrentMood(id: any): Observable<any> {
    return this.http.get('http://127.0.0.1:8000/api/currentmood/' + id)
  }

  logEnergy(userEnergy: any): Observable<any> {
    return this.http.post('http://127.0.0.1:8000/api/setuserenergy', userEnergy);
  }

  updateUserEnergy(userEnergy: any): Observable<any> {
    return this.http.post('http://127.0.0.1:8000/api/updateuserenergy', userEnergy);
  }

  getEnergies(): Observable<any> {
    return this.http.get('http://127.0.0.1:8000/api/energynames');
  }

  getCurrentEnergy(id: any): Observable<any> {
    return this.http.get('http://127.0.0.1:8000/api/currentuserenergy/' + id);
  }
}
