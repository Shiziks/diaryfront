import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-email-verification-error',
  templateUrl: './email-verification-error.component.html',
  styleUrls: ['./email-verification-error.component.css']
})
export class EmailVerificationErrorComponent implements OnInit, OnDestroy {

  email: string = '';
  message: string = "";
  sub!: Subscription;

  constructor(private activatedRoute: ActivatedRoute, private authService: AuthService) { }

  ngOnInit(): void {
    this.email = this.activatedRoute.snapshot.paramMap.get("email") ?? '';
  }

  resend() {
    if (this.email != '') {
      this.message = "Please wait...";

      this.sub = this.authService.resendemail(this.email).subscribe({
        next: result => {
          this.message = result.message;
          setTimeout(() => {
            this.message = '';
          }, 3000);
        },
        error: er => {
          this.message = "Ooops.     " + er.error.message;
          setTimeout(() => {
            this.message = '';
          }, 3500);
        }

      });
    }
  }

  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }
}
