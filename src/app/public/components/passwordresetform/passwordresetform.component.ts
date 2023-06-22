import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-passwordresetform',
  templateUrl: './passwordresetform.component.html',
  styleUrls: ['./passwordresetform.component.css']
})
export class PasswordresetformComponent implements OnInit, OnDestroy {
  [x: string]: any;

  resetPasswordForm: any;
  successMessage = '';
  static error = '';
  register: boolean = true;
  token: string = '';
  email: string = '';
  errorInUrl: string = '';
  sub!: Subscription;


  constructor(private activatedRoute: ActivatedRoute, private auth: AuthService, private router: Router) {

    if (activatedRoute.snapshot.queryParamMap.has('token')) {
      this.token = activatedRoute.snapshot.queryParams['token'];
    }
    if (activatedRoute.snapshot.queryParamMap.has('email')) {
      this.email = activatedRoute.snapshot.queryParams['email'];
    }
    this.resetPasswordForm = new FormGroup({
      emailTs: new FormControl({ value: this.email, disabled: true }, [Validators.required, Validators.email]),
      passwordTs: new FormControl('', [Validators.required]),
      confirmPasswordTs: new FormControl('', [Validators.required]),///pattern za password dodati i custom validator za isto polje kao password
    });
    this.resetPasswordForm.addValidators(
      matchValidator(this.resetPasswordForm.get('passwordTs'), this.resetPasswordForm.get('confirmPasswordTs'))
    );
  }

  ngOnInit(): void {
    setTimeout(() => {
    }, 3000)
  }

  public validateAreEqual(item: AbstractControl): { notSame: boolean } | null {
    return item.value.password === item.value.confirm ? null : { notSame: true };
  }

  resetPassword() {
    if (this.token === '' || this.email === '') {
      this.errorInUrl = "Something went wrong, please go back and try again";
    }
    let dataToSend;
    let email = this.email;
    if (email !== this.resetPasswordForm.get('emailTs').value) {
      PasswordresetformComponent.error = "Email is not correct."
    }
    let password = this.resetPasswordForm.get('passwordTs').value;
    let confirmPassword = this.resetPasswordForm.get('confirmPasswordTs').value;
    if (password === '' || confirmPassword === '') {
      PasswordresetformComponent.error = "You must enter a password and retype it.";
    }
    else {

      PasswordresetformComponent.error = '';
      dataToSend = {
        'email': email,
        'password': password,
        'password_token': this.token
      }

      this.sub = this.auth.passwordReset(dataToSend).subscribe({
        next: result => {
          this.successMessage = "New password has been saved."
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000)
        },
        error: er => {
          console.log(er.error.message);
          if (er.error.message == 'Invalid token.') {
            PasswordresetformComponent.error = "You'r time run out, please go back and request a new password reset link.";
          }
          else PasswordresetformComponent.error = "There has been an error. Please go back and request a new password reset link.";
        }
      });
    }
  }

  get getError() {
    return PasswordresetformComponent.error;
  }

  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }
}

function matchValidator(
  control: AbstractControl,
  controlTwo: AbstractControl
): ValidatorFn {
  return () => {
    if (control.value !== controlTwo.value) {
      PasswordresetformComponent.error = '';
      return { match_error: '* Values do not match.' };
    }
    return null;
  };
}


