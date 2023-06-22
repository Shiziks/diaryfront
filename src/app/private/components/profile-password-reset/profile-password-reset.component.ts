import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-profile-password-reset',
  templateUrl: './profile-password-reset.component.html',
  styleUrls: ['./profile-password-reset.component.css']
})
export class ProfilePasswordResetComponent implements OnInit, OnDestroy {

  formIsValid: boolean = true;
  profileResetPassword: any;
  successMessage: string = '';
  errorMessage: string = '';
  sub!: Subscription;

  constructor(private authService: AuthService) {
    this.profileResetPassword = new FormGroup({
      oldPasswordTs: new FormControl('', [Validators.required]),
      newPassword1Ts: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(30),
        Validators.pattern('^(?=.*\\d)(?=.*[a-zA-Z])(?=.*[A-Z])(?=.*[-\\#\\$\\.\\%\\&\\*])(?=.*[a-zA-Z]).{8,30}$'),
      ]),
      newPassword2Ts: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(30),
      ])
    },
      { validators: this.equalValuesValidator }
    );
  }

  ngOnInit(): void {
  }

  saveChanges() {
    let oldPassword = this.profileResetPassword.get('oldPasswordTs').value;
    let newPassword1 = this.profileResetPassword.get('newPassword1Ts').value;
    let newPassword2 = this.profileResetPassword.get('newPassword2Ts').value;
    let user_id = localStorage.getItem('user_id');

    let dataToSend = {
      'old_password': oldPassword,
      'new_password': newPassword1,
    }
    let done = '';
    this.sub = this.authService.changePassword(dataToSend).subscribe({
      next: result => {
        done = result;
        this.successMessage = "* Password changed successfully";
        setTimeout(() => { this.successMessage = '' }, 2500);
        this.profileResetPassword.reset();
        this.profileResetPassword.markAsPristine();
      },
      error: er => {
        this.errorMessage = "* Old password is incorect";
        setTimeout(() => { this.errorMessage = '' }, 2500);
        this.profileResetPassword.reset();
        this.profileResetPassword.markAsPristine();
      },
    });
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  equalValuesValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const pass = control.get('newPassword1Ts');
    const pass1 = control.get('newPassword2Ts');
    return pass && pass1 && pass.value !== pass1.value ? { equalValues: true } : null;
  };
}
