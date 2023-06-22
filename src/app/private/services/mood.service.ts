import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MoodService {

  constructor(private http: HttpClient) { }

  ///GET ALL MOODS
  getAllMoods(): Observable<any> {
    return this.http.get<any>('http://127.0.0.1:8000/api/moods');
  }

  ///GET ALL USER MOODS
  getAllUserMoods(user_id: number): Observable<any> {
    return this.http.get('http://127.0.0.1:8000/api/allusermoods/' + user_id);
  }

  ///EDIT MOOD
  editMood(data: any): Observable<any> {
    return this.http.post('http://127.0.0.1:8000/api/editmood', data);
  }
}
