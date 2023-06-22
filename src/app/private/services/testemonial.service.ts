import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TestemonialService {

  constructor(private http: HttpClient) { }

  getUserTestemonial(id: number): Observable<any> {
    return this.http.get('http://127.0.0.1:8000/api/gettestemonial/' + id);
  }

  delete(id: any): Observable<any> {
    return this.http.post('http://127.0.0.1:8000/api/deletetestemonial', id);
  }

  addTestemonial(data: any): Observable<any> {
    return this.http.post('http://127.0.0.1:8000/api/cratetestemonial', data);
  }

  editTestemonial(data: any): Observable<any> {
    return this.http.post('http://127.0.0.1:8000/api/edittestemonial', data);
  }
}
