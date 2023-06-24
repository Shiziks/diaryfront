import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, } from '@angular/common/http';
import { IUser } from '../interfaces/i-user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isAuth:any;
  localhost:string="http://127.0.0.1:8000";
  url:string="http://www.melog.000.pe";
  constructor(private http:HttpClient) { }

  //CHECK
  check():Observable<any>{
    return this.http.get(this.url+'/api/check');
  }
  
  //REGISTRATION
  register(user:IUser):Observable<any>{
    return this.http.post(this.url+'/api/register',user);
  }

  //LOGIN
  login(user:IUser):Observable<any>{
    return this.http.post(this.url+'/api/login',user); 
  }

  //USER PROFILE
  profile(token:any):Observable<any>{
    return this.http.post(this.url+'/api/profile',token); 
  }

  //LOGOUT
  logout():Observable<any>{
    return this.http.post(this.url+'/api/logout',{});
  }


  ///REFRESH
  refresh(token?:any):Observable<any>{
    return this.http.post(this.url+'/api/refresh', token);
  }

  ///PASSWORD RESET EMAIL
  passwordResetEmail(email:Object):Observable<any>{
    return this.http.post(this.url+'/api/sendemail', email);
  }

  ///RESET PASSWORD
  passwordReset(data:any):Observable<any>{
    return this.http.post(this.url+'/api/resetpassword', data);
  }

  ////CHANGE PASSWORD
  changePassword(data:any):Observable<any>{
    return this.http.post(this.url+'/api/changepassword', data);
  }

  /////RESEND VERIFY EMAIL
  resendemail(data:any):Observable<any>{
    return this.http.get(this.url+'/api/email/resend/'+data);
  }
  
}
