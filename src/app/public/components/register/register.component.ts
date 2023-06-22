
import { Component, Input, OnDestroy, OnInit, SimpleChange, } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';
import { TokenService } from 'src/app/shared/services/token.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit, OnDestroy {

  isAuth: any;
  formRegister: FormGroup;
  user: any = null;
  token: any;
  message: any = null;
  sub!: Subscription;
  @Input() registerClicked: boolean = false;



  constructor(
    private authService: AuthService,
    private router: Router,
    private tokenService: TokenService,
  ) {
    this.formRegister = new FormGroup({
      firstnameTs: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(30),
        Validators.pattern("^([a-zA-Z',.-]+([a-zA-Z',.-]+)*){2,30}$")
      ]),
      lastnameTs: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(30),
        Validators.pattern("^([a-zA-Z',.-]+( [a-zA-Z',.-]+)*){2,30}$")
      ]),
      genderTs: new FormControl('', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(1),
        Validators.pattern('^[m,f,o]$')
      ]),
      dateTs: new FormControl('', [
        Validators.nullValidator
      ]),
      emailTs: new FormControl('', [
        Validators.required,
        Validators.email,
        Validators.pattern('^[^\\s@]+@([^\\s@.,]+\.)+[^\\s@.,]{2,}$')
      ]),
      passwordTs: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(30),
        Validators.pattern('^(?=.*\\d)(?=.*[a-zA-Z])(?=.*[A-Z])(?=.*[-\\#\\$\\.\\%\\&\\*])(?=.*[a-zA-Z]).{8,30}$'),//dodati patern za password
      ]),
      password1Ts: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(30),]
      )
    },
      { validators: this.equalValuesValidator }
    );
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChange) {
    if (this.registerClicked) {
      this.message = null;
    }
  }

  equalValuesValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const pass = control.get('passwordTs');
    const pass1 = control.get('password1Ts');

    return pass && pass1 && pass.value !== pass1.value ? { equalValues: true } : null;
  };

  register(): void {
    this.message = "Please wait..."
    this.user = {
      first_name: this.formRegister.get('firstnameTs')?.value,
      last_name: this.formRegister.get('lastnameTs')?.value,
      email: this.formRegister.get('emailTs')?.value,
      password: this.formRegister.get('passwordTs')?.value,
      gender: this.formRegister.get('genderTs')?.value,
      birth_date: this.formRegister.get('dateTs')?.value,
      roles: [{ name: 'user', id: 0 }]
    }

    this.sub = this.authService.register(this.user).subscribe({
      next: data => {
        this.responseHandler(data);
      },
      error: er => {
        console.log(er);
        this.message = "Ooops!!! Please check your data and try again";
        setTimeout(() => {
          this.message = null;
        }, 3000)
      },
      complete: () => {
        this.message = "Verification email has been sent to you.";
        this.formRegister.reset();
      }
    });
  }
  responseHandler(data: any) {
    this.tokenService.setToken(data.auth.token, data.auth.expires);
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }
}
