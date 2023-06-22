import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EnergiesService {

  constructor(private http: HttpClient) { }

  /////GET ENERGIES
  getEnergies(): Observable<any> {
    return this.http.get("http://127.0.0.1:8000/api/energynames");
  }

  /////EDIT ENERGY
  editEnergy(data: any): Observable<any> {
    return this.http.post("http://127.0.0.1:8000/api/editenergy", data);
  }

  getAllUserEnergies(user_id: number): Observable<any> {
    return this.http.get('http://127.0.0.1:8000/api/alluserenergy/' + user_id);
  }

}
