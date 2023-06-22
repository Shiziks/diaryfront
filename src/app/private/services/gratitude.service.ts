import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { IGratitudes } from '../interfaces/i-gratitudes';
import { IGratitudeByGroup } from '../interfaces/i-gratitudes';

@Injectable({
  providedIn: 'root'
})
export class GratitudeService {

  constructor(private http: HttpClient) { }

  ///LOG GRATITUDES
  logGratitudes(gratitudes: any): Observable<any> {
    return this.http.post('http://127.0.0.1:8000/api/setgratitudes', gratitudes);
  }

  ///UPDATE GRATITUDES
  updateGratitudes(gratitudes: any): Observable<any> {
    return this.http.post('http://127.0.0.1:8000/api/updategratitudes', gratitudes);
  }

  ///GET CURRENT GRATITUDES
  getCurrentGratitudes(user_id: any): Observable<any> {
    return this.http.post('http://127.0.0.1:8000/api/currentusergratitudes', user_id);
  }

  ///GET ALL USER GRATITUDES
  getAllUserGratitudes(user_id: number): Observable<IGratitudes[]> {
    return this.http.get<IGratitudes[]>('http://127.0.0.1:8000/api/allusergratitudes/' + user_id);
  }

  ///GET USER GRATITUDES ORGANIZED BY GROUP ID
  getUserGratitudesByGroup(user_id: number): Observable<IGratitudeByGroup[]> {
    return this.http.get<IGratitudes[]>('http://127.0.0.1:8000/api/getgratitudesbygroup/' + user_id)
      .pipe(
        map(gratitudes =>
          gratitudes.map(gratitude => (
            {
              created_at: gratitude.created_at,
              group_id: gratitude.group_id,
              gratitudes: gratitude.gratitudes.split('^ ')
            })
          )))
  }

  /////DELTE GRATITUDE
  deleteGratitudes(data: any): Observable<any> {
    return this.http.post('http://127.0.0.1:8000/api/deletegratitudes', data);
  }
}


