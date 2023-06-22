import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, mergeMap, Observable } from 'rxjs';
import { IDayloginfo } from '../interfaces/i-dayloginfo';

@Injectable({
  providedIn: 'root'
})
export class DaylogService {

  constructor(private http: HttpClient) { }

  ///GET ALL USER DAY LOGS
  allUserDayLogs(id: number): Observable<any> {
    return this.http.get('http://127.0.0.1:8000/api/getalluserdaylogs/' + id);
  }

  ///POST DAYLOG
  postDaylog(daylog: any) {
    return this.http.post('http://127.0.0.1:8000/api/postdaylog', daylog);
  }

  ///ADD IMAGE
  uploadImages(image: any) {
    const headers = new HttpHeaders(); //neophodni su zbog multipart zbog nekih servera
    return this.http.post('http://127.0.0.1:8000/api/daylogimage', image, { headers: headers });
  }

  ///GET DAY LOG
  getDayLog(id: number): Observable<IDayloginfo> {
    const headers = new HttpHeaders(); //neophodni su zbog multipart zbog nekih servera
    return this.http.get<IDayloginfo>('http://127.0.0.1:8000/api/getdaylog/' + id, { headers: headers });
  }

  /////DELETE DAYLOG
  deleteDaylog(daylog_id: any): Observable<any> {
    return this.http.post<any>('http://127.0.0.1:8000/api/deletedaylog', daylog_id);
  }
}
