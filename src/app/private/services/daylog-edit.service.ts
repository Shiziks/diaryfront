import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, mergeMap, Observable } from 'rxjs';
import { IDayLog } from '../interfaces/i-day-log';
import { Idaylogedit } from '../interfaces/i-daylogedit';
import { IImages } from '../interfaces/i-images';

@Injectable({
  providedIn: 'root'
})
export class DaylogEditService {

  constructor(private http: HttpClient) { }

  private dayLog$ = new BehaviorSubject<Idaylogedit>(null!);
  shareThisDayLog = this.dayLog$.asObservable().pipe(
    mergeMap(({ daylog_id, title, text, created_at }) =>
      this.getAllPostImages(daylog_id).pipe(
        map((imagesarray) => ({ images: imagesarray, title, text, created_at, daylog_id }))
      )
    ));

  ///SHARE DAYLOG DATA
  shareDayLog(daylog: Idaylogedit) {
    this.dayLog$.next(daylog);
  }

  ///GET ALL POST IMAGES
  getAllPostImages(daylog_id: any): Observable<IImages[]> {
    const headers = new HttpHeaders(); //neophodni su zbog multipart zbog nekih servera
    return this.http.get<IImages[]>('http://127.0.0.1:8000/api/getallpostimages/' + daylog_id, { headers: headers });
  }

  ///UPDATE DAYLOG
  updateDayLog(dayLog: IDayLog): Observable<IDayLog> {
    return this.http.post<IDayLog>('http://127.0.0.1:8000/api/updatedaylog', dayLog);
  }

}
