import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {

  constructor(private http: HttpClient) { }

  ///GET ALL STEP LOGS
  getAllUserSteps(id: number): Observable<any> {
    return this.http.get('http://127.0.0.1:8000/api/allusersteps/' + id);

  }

  ///SAVE STEPS LOG
  saveStepsLog(data: any): Observable<any> {
    return this.http.post('http://127.0.0.1:8000/api/saveusersteps', data);
  }

  ///UPDATE STEPS LOG
  updateStepLog(data: any): Observable<any> {
    return this.http.post('http://127.0.0.1:8000/api/updateusersteps', data);
  }

  /////GET ALL WORKOUTS
  getAllWorkouts(user_id: number): Observable<any> {
    return this.http.get('http://127.0.0.1:8000/api/getalluserworkouts/' + user_id);
  }

  /////SAVE WORKOUT LOG
  saveWorkout(data: any): Observable<any> {
    return this.http.post('http://127.0.0.1:8000/api/loguserworkout', data);
  }

  /////DELETE USER WORKOUT
  deleteworkout(id: any): Observable<any> {
    return this.http.post('http://127.0.0.1:8000/api/deleteworkout', id);
  }

  ////// GET CATEGORY SUBCATEGORIES
  getCatSubcategories(id: number | string): Observable<any> {
    return this.http.get('http://127.0.0.1:8000/api/getcategorysubcategories/' + id);
  }


  /////CHANGE ADMIN STATUS
  changeAdminStatus(data: any): Observable<any> {
    return this.http.post('http://127.0.0.1:8000/api/changesubcategorystatus', data);
  }
}
