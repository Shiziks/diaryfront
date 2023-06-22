import { Injectable, OnDestroy } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { map, } from 'rxjs';
import { AuthStateService } from '../services/auth-state.service';

@Injectable({
  providedIn: 'root'
})
export class UserRoleGuard implements CanActivate, OnDestroy{

  x:any;

  constructor(private authState:AuthStateService, private router:Router){
  }


  canActivate(route: ActivatedRouteSnapshot,state: RouterStateSnapshot): any{
    let u:any;
    let a :any;
    this.x= this.authState.roleStatus.pipe(map((r => {
      for(let i=0; i<r.length; i++){
        if(r[i].role_name=='user'){
          u=true;
        }
        else if(r[i].role_name=='admin'){
          a=true;
        }
      }
      if(u){
        return true;
      }
      else if(a){
        this.router.navigate(['/admin/admin']);
        return false;
      }
      else{
        this.router.navigate(['/mistake']);
        return false;
      }  
    })));
    let tmp=this.x.subscribe((value:any)=>{
      return value;});
    return tmp;
  }

  ngOnDestroy(){
    this.x.unsubscribe
  }
}
