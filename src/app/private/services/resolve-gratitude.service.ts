import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { GratitudeService } from './gratitude.service';
import { filter } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class ResolveGratitudeService implements Resolve<any>{

  user_id = { 'user_id': localStorage.getItem('user_id') };
  data: any;

  constructor(private gratitudeSrevice: GratitudeService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.gratitudeSrevice.getCurrentGratitudes(this.user_id).pipe(
      filter(data => { return data.data; })
    );
  }
}
