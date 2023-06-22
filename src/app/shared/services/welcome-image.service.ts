import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class WelcomeImageService {

  constructor(private http: HttpClient) {
  }

  /////SAVE IMAGES
  uploadImages(data: any): Observable<any> {
    return this.http.post('http://127.0.0.1:8000/api/addimages', data);
  }

  /////GET IMAGES
  getImages(): Observable<any> {
    return this.http.get('http://127.0.0.1:8000/api/getallimages');
  }

  ////DELETE IMAGE
  deleteImage(id: any): Observable<any> {
    return this.http.post('http://127.0.0.1:8000/api/deleteappimage', id);
  }
}
