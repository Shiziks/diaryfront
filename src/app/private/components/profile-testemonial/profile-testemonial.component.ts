import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { TestemonialService } from '../../services/testemonial.service';

@Component({
  selector: 'app-profile-testemonial',
  templateUrl: './profile-testemonial.component.html',
  styleUrls: ['./profile-testemonial.component.css']
})
export class ProfileTestemonialComponent implements OnInit, OnDestroy {

  errorMessage: string = "";
  successMessage: string = '';
  testemonialForm!: FormGroup;
  label: string = "Add a review:";
  existingTestemonial: boolean = false;
  user_id: number = 0;
  testemonial: any;
  error: string = '';
  sub: Subscription[] = [];

  constructor(private testemonialService: TestemonialService) {
    this.testemonialForm = new FormGroup({
      testemonialTs: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(150)]),
      titleTs: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(30)]),
      anonymousTs: new FormControl('', [Validators.nullValidator])
    });
  }

  ngOnInit(): void {
    this.user_id = Number(localStorage.getItem('user_id'));
    if (this.user_id > 1) {
      let sub1 = this.testemonialService.getUserTestemonial(this.user_id).subscribe({
        next: result => {
          if (result.user) {
            this.testemonial = result;
            this.label = "Change your existing review:";
            this.testemonialForm.get('titleTs')?.setValue(this.testemonial.user.title);
            this.testemonialForm.get('testemonialTs')?.setValue(this.testemonial.user.text);
            this.testemonialForm.get('anonymousTs')?.setValue(this.testemonial.user.anonymous);
            this.existingTestemonial = true;
          }
        },
        error: er => {
          console.log(er);
          this.errorMessage = "There has been an error. Please try again later";
          setTimeout(() => {
            this.errorMessage = "";
          }, 3000);
        }
      });
      this.sub.push(sub1);
    }
  }

  saveChanges() {
    let title = this.testemonialForm.get('titleTs')?.value;
    let text = this.testemonialForm.get('testemonialTs')?.value;
    let anonymous = this.testemonialForm.get('anonymousTs')?.value ? 1 : 0;
    if (title != '' && text != '') {
      let data = {
        'title': title,
        'text': text,
        'user_id': this.user_id,
        'anonymous': anonymous
      }
      let sub2 = this.testemonialService.addTestemonial(data).subscribe({
        next: result => {
          this.testemonial = result;
          this.existingTestemonial = true;
          this.label = "Change your existing review:";
          this.testemonialForm.get('titleTs')?.setValue(this.testemonial.user.title);
          this.testemonialForm.get('testemonialTs')?.setValue(this.testemonial.user.text);
          this.testemonialForm.get('anonymousTs')?.setValue(this.testemonial.user.anonymous);
          this.successMessage = "* Testemonial successfully saved.";
          setTimeout(() => {
            this.successMessage = '';
          }, 3000);
        },
        error: er => {
          console.log(er);
          this.error = "* Something went wrong. Please check your data and try again.";
          setTimeout(() => {
            this.error = '';
          }, 3000);
        }
      });
      this.sub.push(sub2);
    }
  }


  delete(id: number) {
    if (id > 0) {
      let data = {
        'id': id
      };
      let sub3 = this.testemonialService.delete(data).subscribe({
        next: result => {
          if (result) {
            this.existingTestemonial = false;
            this.testemonial = null;
            this.label = "Add a review:";
            this.testemonialForm.reset();
            this.testemonialForm.markAsPristine();
          }
        },
        error: er => {
          console.log(er);
        }
      });
      this.sub.push(sub3);
    }
  }


  editTestemonial() {
    let title = this.testemonialForm.get('titleTs')?.value;
    let text = this.testemonialForm.get('testemonialTs')?.value;
    let anonymous = this.testemonialForm.get('anonymousTs')?.value ? 1 : 0;
    if (title != '' && text != '') {
      let data = {
        'title': title,
        'text': text,
        'user_id': this.user_id,
        'anonymous': anonymous,
        'id': this.testemonial.user.id
      }
      let sub4 = this.testemonialService.editTestemonial(data).subscribe({
        next: result => {
          this.testemonial = result;
          this.existingTestemonial = true;
          this.successMessage = "* Testemonial successfully edited.";
          this.testemonialForm.markAsPristine();
          this.testemonialForm.markAsUntouched();

          setTimeout(() => {
            this.successMessage = '';
          }, 3000)
        },
        error: er => {
          console.log(er);
        }
      });
      this.sub.push(sub4);
    }
  }

  ngOnDestroy(): void {
    if (this.sub.length > 0) {
      this.sub.forEach((subscription) => subscription.unsubscribe());
    }
  }
}
