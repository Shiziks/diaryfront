import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IImages } from '../interfaces/i-images';

@Injectable({
  providedIn: 'root'
})
export class UserphotosService {

  constructor(private http: HttpClient) { }

  /////GET ALL USER PHOTOS
  getUserPhotos(id: number): Observable<IImages[]> {
    const headers = new HttpHeaders();
    return this.http.get<IImages[]>('http://127.0.0.1:8000/api/getuserphotos/' + id, { headers: headers });
  }

  /////DELETE PHOTO
  deleteUserPhoto(info: any): Observable<IImages[]> {
    const headers = new HttpHeaders();
    return this.http.post<IImages[]>('http://127.0.0.1:8000/api/deletephoto', info, { headers: headers });
  }

  /////ADD PHOTO
  addPhoto(files: any): Observable<any> {
    console.log("USAO U SERVIS");
    const headers = new HttpHeaders();
    return this.http.post<any>('http://127.0.0.1:8000/api/savephoto', files, { headers: headers });
  }

  /////EDIT PROFILE IMAGE
  editProfileImage(data: any): Observable<any> {
    return this.http.post<any>('http://127.0.0.1:8000/api/editprofilephoto', data);
  }
}
