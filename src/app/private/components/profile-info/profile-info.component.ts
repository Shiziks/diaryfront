import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { UserDataService } from 'src/app/shared/services/user-data.service';
import { IUser } from '../../interfaces/i-user';

@Component({
  selector: 'app-profile-info',
  templateUrl: './profile-info.component.html',
  styleUrls: ['./profile-info.component.css']
})
export class ProfileInfoComponent implements OnInit, OnDestroy {

  @Input() firstName?: string;
  @Input() lastName?: string;
  @Input() gender: string = "";
  @Input() email: string = "";
  @Input() birthDay: string = '';
  editInfoForm: FormGroup;
  successMessage: boolean = false;
  errorMessage: boolean = false;
  sub!: Subscription;

  @Output() newFullName = new EventEmitter<string>();

  constructor(private userData: UserDataService) {
    this.editInfoForm = new FormGroup({
      firstNameTs: new FormControl('', [Validators.required, Validators.minLength(2), Validators.pattern('^([A-Z][a-z]{1,15}){1}((\\s)[A-Z][a-z]{1,15}){0,2}$')]),
      lastNameTs: new FormControl('', [Validators.required, Validators.minLength(2), Validators.pattern('^([A-Z][a-z]{1,15}){1}((\\s)[A-Z][a-z]{1,15}){0,2}$')]),
      genderTs: new FormControl('', [Validators.required]),
      birthDateTs: new FormControl('', [Validators.required]),
      emailTs: new FormControl('', [Validators.required, Validators.email, Validators.pattern('^\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,3})+$')]),

    })
  }

  ngOnInit(): void {
  }

  ngOnChanges(): void {
    if (this.firstName && this.lastName && this.email) {
      this.editInfoForm.patchValue({
        firstNameTs: this.firstName,
        lastNameTs: this.lastName,
        birthDateTs: this.birthDay,
        emailTs: this.email,
        genderTs: this.gender
      });
    }
  }

  editUserInfo() {
    let data: IUser = {};

    if (this.editInfoForm.get('firstNameTs')?.touched) {
      data.first_name = this.editInfoForm.get('firstNameTs')?.value;
    }
    if (this.editInfoForm.get('lastNameTs')?.touched) {
      data.last_name = this.editInfoForm.get('lastNameTs')?.value;
    }
    if (this.editInfoForm.get('birthDateTs')?.touched) {
      data.birth_date = this.editInfoForm.get('birthDateTs')?.value;
    }
    if (this.editInfoForm.get('genderTs')?.touched) {
      data.gender = this.editInfoForm.get('genderTs')?.value;
    }
    if (this.editInfoForm.get('emailTs')?.touched && this.editInfoForm.get('emailTs')?.value != this.email) {
      data.email = this.editInfoForm.get('emailTs')?.value;
    }



    if (data) {
      let user_id = Number(localStorage.getItem('user_id'));
      data.user_id = user_id;
      this.sub = this.userData.editUserData(Object(data)).subscribe({
        next: result => {
          //Vracene podatke sacuvati u promenljive i local Storage -NE MORA LOCAL STORAGE
          this.newFullName.emit(result.data);
          this.successMessage = true;
          setTimeout(() => { this.successMessage = false; }, 3000);

        },
        error: er => {
          console.log(er.message);
          this.errorMessage = true;
          setTimeout(() => { this.errorMessage = false; }, 5000);
        }
      })
    }
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }
}
