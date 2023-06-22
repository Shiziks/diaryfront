import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ImagesService {

  constructor(private http: HttpClient) { }

  deleteImages(id: number, image_name: string) {
    let datatosend = { id: id, file_name: image_name };
    return this.http.post('http://127.0.0.1:8000/api/deleteimage', datatosend);
  }
}
