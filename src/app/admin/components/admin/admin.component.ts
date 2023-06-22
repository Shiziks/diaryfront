import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map, Subscription } from 'rxjs';
import { AuthStateService } from 'src/app/shared/services/auth-state.service';
import { UserDataService } from 'src/app/shared/services/user-data.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit, OnDestroy {

  clicked: boolean = false;
  url: string = '';
  roles!: any;
  sub: Subscription[] = [];

  button: any = "";
  constructor(private router: Router, private userService: UserDataService, private authState: AuthStateService) {

  }

  ngOnInit(): void {
    this.url = this.router.url;
    let sub1 = this.router.events.pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => { this.url = event.url });

    let sub2 = this.userService.userData().pipe(map((user: any) => {
      return user.roles;
    })).subscribe({
      next: result => {
        let roles = result;
        this.authState.setRoles(roles);
      },
      error: er => {
        console.log(er);
      }
    });
    this.sub.push(sub1);
    this.sub.push(sub2);
  }



  activeElement(element: HTMLButtonElement) {
    if (this.button == '') {
      this.button = element;
      element.classList.add('active');
    }
    else {
      this.button.classList.remove('active');
      element.classList.add('active');
      this.button = element;
    }
  }

  ngOnDestroy(): void {
    if (this.sub.length > 0) {
      this.sub.forEach((subscription) => subscription.unsubscribe());
    }
  }

}
