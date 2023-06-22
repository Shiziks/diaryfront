import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-resetpassword',
  templateUrl: './resetpassword.component.html',
  styleUrls: ['./resetpassword.component.css']
})
export class ResetpasswordComponent implements OnInit, OnDestroy {

  register: boolean = true;
  error: string = "";
  sendEmailForm: any;
  email: string = "";
  successMessage?: string;
  disabled: boolean = false;
  sub!: Subscription;

  constructor(private authService: AuthService,) {
    this.sendEmailForm = new FormGroup({
      emailTs: new FormControl('', [Validators.required, Validators.email]),
    });
  }

  ngOnInit(): void {
  }


  sendEmail() {
    this.disabled = true;
    this.email = this.sendEmailForm.get('emailTs')?.value;
    if (this.email !== '') {
      let dataToSend = {
        email: this.email
      }

      setTimeout(() => {
        this.successMessage = "We are sending the email to: " + this.email;
      }, 500);

      this.sub = this.authService.passwordResetEmail(dataToSend).subscribe({
        next: result => {
          this.error = '';
          this.disabled = false;
          this.successMessage = "We are sending the email to: " + this.email;
          this.successMessage = result.data;

          this.sendEmailForm.reset();
        },
        error: err => {
          this.successMessage = '';
          this.disabled = false;
          this.error = err.error.message;
        },
      });
    }
  }


  inputClick() {
    if (this.error !== '' || this.successMessage !== '') {
      this.error = '';
      this.successMessage = '';
      this.sendEmailForm.reset();
    }
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }
}
