import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WaterService {

  constructor(private http: HttpClient) { }

  /////GET ALL USER WATERS
  getAllUserWaterLogs(user_id: number): Observable<any> {
    return this.http.get('http://127.0.0.1:8000/api/getallwaterlogs/' + user_id);
  }

  /////LOG USER WATER INTAKE
  logWaterIntake(waterGlasses: any): Observable<any> {
    return this.http.post('http://127.0.0.1:8000/api/logwaterintake', waterGlasses);
  }

  /////UPDATE USER WATER INTAKE
  updateWaterIntake(waterGlasses: any): Observable<any> {
    return this.http.post('http://127.0.0.1:8000/api/updatewaterintake', waterGlasses);
  }

  /////GET ALL WATER GLASSES
  getAllWaterGlasses(): Observable<any> {
    return this.http.get('http://127.0.0.1:8000/api/getallwaterglasses');
  }

  /////EDIT WATER GLASSES
  editWaterGlasses(data: any): Observable<any> {
    return this.http.post('http://127.0.0.1:8000/api/editwaterglasses', data);
  }
}
