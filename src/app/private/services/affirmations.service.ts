import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { IAffirmations } from '../interfaces/i-affirmations';

@Injectable({
  providedIn: 'root'
})
export class AffirmationsService {

  constructor(private http: HttpClient) { }

  getAffirmations() {
    return this.http.get<IAffirmations[]>('http://127.0.0.1:8000/api/getallaffirmations/');
  }

  /////EDIT AFFIRMATION
  editAffirmation(data: IAffirmations): Observable<any> {
    return this.http.post('http://127.0.0.1:8000/api/editaffirmation', data);
  }

  /////ADD AFFIRMATION
  addAffirmation(data: IAffirmations): Observable<any> {
    return this.http.post('http://127.0.0.1:8000/api/addaffirmation', data);
  }

  ///DELETE AFFIRMATION
  deleteAffirmation(data: any): Observable<any> {
    return this.http.post('http://127.0.0.1:8000/api/deleteaffirmation', data);
  }

}
