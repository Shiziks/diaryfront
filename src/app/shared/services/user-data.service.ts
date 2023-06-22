import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {

  constructor(private http: HttpClient) { }

  /////USER DATA
  userData(): Observable<any> {
    return this.http.get('http://127.0.0.1:8000/api/userdata');
  }

  /////EDIT USER DATA
  editUserData(data: any): Observable<any> {
    return this.http.post('http://127.0.0.1:8000/api/edituserdata', data);
  }

  /////SEARCH FOR USER
  searchForUser(email: string): Observable<any> {
    return this.http.get('http://127.0.0.1:8000/api/getuser/' + email);
  }

  /////MAKE USER ADMIN
  makeAdmin(data: any): Observable<any> {
    return this.http.post('http://127.0.0.1:8000/api/makeadmin', data);
  }

  /////REMOVE ADMIN ROLE
  removeAdminRole(data: any) {
    return this.http.post('http://127.0.0.1:8000/api/removeadmin', data);
  }

  /////GET ROLES
  getRoles(): Observable<any> {
    return this.http.get('http://127.0.0.1:8000/api/getallroles');
  }
}
