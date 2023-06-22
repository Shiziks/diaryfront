import { Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { AuthStateService } from 'src/app/shared/services/auth-state.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { TokenService } from 'src/app/shared/services/token.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  errorEmail: boolean = false;
  errorPassword: boolean = false;
  isAuth = false;
  loginForm: FormGroup;
  user: any;
  name: string = "";
  token: any;
  error: any = null;
  regPassword: string = "^(?=.*\\d)(?=.*[a-zA-Z])(?=.*[A-Z])(?=.*[-\\#\\$\\.\\%\\&\\*])(?=.*[a-zA-Z]).{8,30}$";
  url: string = '';
  verifiedError: boolean = false;
  sub: Subscription[] = [];


  constructor(
    private authService: AuthService,
    private authState: AuthStateService,
    private router: Router,
    private tokenService: TokenService,

  ) {
    this.loginForm = new FormGroup({
      emailTs: new FormControl('', [Validators.required, Validators.email,
      Validators.pattern('^[^\\s@]+@([^\\s@.,]+\.)+[^\\s@.,]{2,}$')
      ]),
      passwordTs: new FormControl('', [Validators.required,
      Validators.minLength(8),
      Validators.maxLength(30),
      //Validators.pattern(this.regPassword)
      ])
    });

    // At least 8 - 16 characters,
    // must contain at least 1 uppercase letter,
    // must contain at least 1 lowercase letter,
    // and 1 number
    // Can contain any of this special characters $ % # * & - .

  }


  ngOnInit(): void {
    this.url = this.router.url;
    this.token = this.tokenService.getToken();
  }

  login() {
    if (this.loginForm.valid) {
      this.user = {
        email: this.loginForm.get('emailTs')?.value,
        password: this.loginForm.get('passwordTs')?.value
      }
      let sub1 = this.authService.login(this.user).subscribe({
        next: data => {
          this.responseHandler(data);
        },
        error: er => {
          this.handleError(er);
        },
        complete: () => {
          this.loginForm.reset();
        }
      });
      this.sub.push(sub1);
    }

  }


  responseHandler(data: any) {
    localStorage.setItem('user_id', data.user.id);
    localStorage.setItem('user_roles', JSON.stringify(data.roles));
    let roles = data.roles;
    let expires = moment().add(data.auth.expires, 'second');
    let expiresAt = JSON.stringify(expires.valueOf());
    this.tokenService.setToken(data.auth.token, expiresAt);
    this.authState.changeAuthState();
    this.authState.setLogedInValue(true);
    this.authState.setRoles(roles);
    this.name = data.user.first_name;
    localStorage.setItem('name', this.name);
    /////AKO JE ROLE USER PREUSMERITI NA PROFILE, AKO JE ROLE ADMIN PREUSMERITI NA ADMIN
    if (this.url == '/login/admin' || this.roleExists(roles, 'admin')) {
      this.router.navigate(['admin/admin']);
    }
    else {
      this.router.navigate(['profile']);
    }
  }

  handleError(error: any) {
    if (error.status == 403 && error.error.message == "Email must be verified.") {
      this.error = "Please verify your email first.";
      this.verifiedError = true;
    }
    else {
      this.verifiedError = false;
      this.error = "Ooops.     " + error.error.message;
      setTimeout(() => {
        this.error = null;
      }, 3500);
    }
  }

  roleExists(roles: any, rolecheck: any) {
    return roles.some((role: any) => {
      return role.role_name === rolecheck;
    });
  }

  verifyEmail() {
    let email = this.loginForm.get('emailTs')?.value;
    if (email != "" && email != null && email != undefined) {
      this.error = "Please wait...";

      let sub2 = this.authService.resendemail(email).subscribe({
        next: response => {
          this.error = response.message;
          setTimeout(() => {
            this.error = null;
            this.verifiedError = false;
          }, 3000);
        },
        error: err => {
          this.error = "Ooops.     " + err.error.message;
          setTimeout(() => {
            this.error = null;
          }, 3500);
        }
      });
      this.sub.push(sub2);
    }
  }

  ngOnDestroy() {
    if (this.sub.length > 0) {
      this.sub.forEach((subscription) => subscription.unsubscribe());
    }
  }
}
