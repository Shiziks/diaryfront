import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class TestemonialsService {

  constructor(private http: HttpClient) { }

  getAllTestemonials(): Observable<any> {
    return this.http.get('http://127.0.0.1:8000/api/getalltestemonials');
  }
}
