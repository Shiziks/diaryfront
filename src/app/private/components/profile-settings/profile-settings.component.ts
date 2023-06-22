import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { AuthStateService } from 'src/app/shared/services/auth-state.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-profile-settings',
  templateUrl: './profile-settings.component.html',
  styleUrls: ['./profile-settings.component.css']
})
export class ProfileSettingsComponent implements OnInit, OnDestroy {

  fullName: string = "John Doe";
  email: string = "";
  birthDate: string = "";
  userSince: string = '';
  firstName: string = "";
  lastName: string = "";
  gender: string = "o";
  birthDay: string = "";
  user_id: number = 0;
  profilePhoto: string = "";
  sub!: Subscription;


  constructor(private auth: AuthService, private authState: AuthStateService) { }

  ngOnInit(): void {
    ///DA LI JE DOVOLJNO DA PODATKE O USERU IZVUCEM SAMO PRILIKOM AUTENTIKACIJE I POSLE NE
    let token = localStorage.getItem('auth_token');
    this.sub = this.auth.profile(token).subscribe({
      next: result => {
        this.firstName = result.first_name;
        this.lastName = result.last_name;
        this.fullName = result.first_name + " " + result.last_name;
        this.gender = result.gender ? result.gender : null;
        this.email = result.email;
        this.user_id = result.id;
        this.authState.setRoles(result.roles);
        if (result.birth_date) {
          let tmpBD = result.birth_date.split('-');
          this.birthDate = tmpBD[1] + "/" + tmpBD[2] + "/" + tmpBD[0];
          this.birthDay = result.birth_date;
        }
        else {
          this.birthDate = "Please input your birth date."
        }
        let tmpUS = new Date(result.created_at);
        this.userSince = tmpUS.getMonth() + '/' + tmpUS.getDate() + '/' + tmpUS.getFullYear();


      },
      error: er => { console.log(er) }
    });

  }

  detectChange(event: any) {
    this.fullName = event.first_name + " " + event.last_name;
    let tmpBD = event.birth_date.split('-');
    this.birthDate = tmpBD[1] + "/" + tmpBD[2] + "/" + tmpBD[0];
  }


  ///FUNKCIJA ZA PRIMANJE PROFILNE SLIKE
  profilePhotoReceived(item: any) {
    if (item == '') {
      this.profilePhoto = '';
    }
    else {
      this.profilePhoto = 'http://127.0.0.1:8000/' + item;
    }
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

}
