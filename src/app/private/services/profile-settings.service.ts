import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ProfileSettingsService {

  private setting$ = new BehaviorSubject<any>({});
  selectedSetting$ = this.setting$.asObservable();

  constructor(private http: HttpClient) { }

  setSettings(setting: any) {
    this.setting$.next(setting);
  }

  getSettings(user_id: number): Observable<any> {
    return this.http.get('http://127.0.0.1:8000/api/userprofilesettings/' + user_id);
  }

  getCategories(): Observable<any> {
    return this.http.get('http://127.0.0.1:8000/api/profilecategories/');
  }

  changeAdminStatus(data: any): Observable<any> {
    return this.http.post('http://127.0.0.1:8000/api/changeadminstatus/', data);

  }
}
