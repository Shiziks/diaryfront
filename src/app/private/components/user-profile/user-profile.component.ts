import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { IUser } from 'src/app/shared/interfaces/i-user';
import { AuthStateService } from 'src/app/shared/services/auth-state.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { TokenService } from 'src/app/shared/services/token.service';
import { UserDataService } from 'src/app/shared/services/user-data.service';
import { WelcomeImageService } from 'src/app/shared/services/welcome-image.service';
import { IDayLog } from '../../interfaces/i-day-log';
import { IGratitudes } from '../../interfaces/i-gratitudes';
import { ProfileSettingsService } from '../../services/profile-settings.service';
import { QuoteService } from '../../services/quote.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit, OnDestroy {

  allDayLogs?: IDayLog[] = [];
  showDayLogs: boolean = false;
  link = '/profile';
  name: string = '';

  validToken: any;
  token: string = '';
  quote: any;
  defaultQuote: string = "This is a general quote.";
  username: any = "";
  user: IUser | any;
  gratitudeInfo: any;
  authenticated: boolean = false;
  user_id: number = 0;
  settings: any;
  secondPart: any = [];
  firstPart: any = [];
  lastSetting: any;
  subscriptions: Subscription[] = [];

  showGratitudes: boolean = false;
  allGratitudes?: IGratitudes[] = [];
  receivedFromUserProfile?: boolean;
  welcomeImageInfo: any;


  constructor(
    private authService: AuthService,
    private tokenService: TokenService,
    private quoteService: QuoteService,
    private router: Router,
    private userData: UserDataService,
    private profileSettings: ProfileSettingsService,
    private authState: AuthStateService,
    private cdRef: ChangeDetectorRef,
    private welcomeImage: WelcomeImageService
  ) { }



  ngOnInit(): void {
    var s1 = this.authState.roleStatus.subscribe((value: any) => {
    });
    this.subscriptions.push(s1);

    var s2 = this.welcomeImage.getImages().subscribe((data: any) => {
      let x = Math.floor(Math.random() * (data.length));
      this.welcomeImageInfo = data[x];
    })
    this.subscriptions.push(s2);

    this.user_id = Number(localStorage.getItem('user_id'));
    this.token = this.tokenService.getToken(); //iz local storge

    if (this.user_id > 0 && this.token != '') {
      let tokenValid = this.tokenService.isValidToken();
      if (tokenValid) {
        this.authState.setLogedInValue(true);
        this.authState.changeAuthState(this.token);
        var s3 = this.userData.userData().subscribe({
          next: data => {
            this.name = data.first_name;
            this.username = data.first_name + " " + data.last_name;
            this, this.authState.setRoles(data.roles);
          },
          error: er => {
            console.log(er.message);
            //greska moze biti samo ako je neautorizovani korisnik ili greska baze
          }
        });
        this.subscriptions.push(s3);
        this.getProfileSettings();

        let s4 = this.quoteService.getRandomQuote(this.token).subscribe({
          next: result => {
            this.quote = this.uppercaseSentance(result.number.quote_text);
          },
          error: er => {
            // localStorage.clear();
            // this.router.navigate(['login']);
            this.quote = "Every day brings new choices.";
          }
        });
        this.subscriptions.push(s4);
      }
    }
    else {
      this.authService.logout();
      this.authState.setLogedInValue(false);
      this.tokenService.removeToken();
      this.router.navigate(['/login']);
    }

  }
  uppercaseSentance(quote: string): string {
    return '"' + quote[0].toUpperCase() + quote.substring(1).toLowerCase() + '"';
  }

  showDayLog(event: boolean) {
    this.showDayLogs = event;
  }

  allDayLog(event: IDayLog[]) {
    this.allDayLogs = event;
  }

  showGratitude(event: any) {
    this.showGratitudes = event;
  }

  changeEmitted(event: any) {
    let data = event;
    this.getProfileSettings();
  }


  /////GET PROFILE SETTINGS
  getProfileSettings() {
    var s5 = this.profileSettings.getSettings(this.user_id).subscribe({
      next: result => {
        this.secondPart = [];
        this.firstPart = [];
        this.settings = result.data;
        for (let i = 0; i < this.settings.length; i++) {
          if (this.settings[i].name === 'daylog' && this.settings[i].status == '1') {
            this.secondPart.push(this.settings[i]);
          }
          else if (this.settings[i].name === 'gratitude' && this.settings[i].status == '1') {
            this.secondPart.push(this.settings[i]);
          }
          else if (this.settings[i].status == '1') {
            this.firstPart.push(this.settings[i]);
          }

        }

        this.lastSettingName(this.firstPart);

      },
      error: er => {
        console.log(er.message);
      }
    });
    this.subscriptions.push(s5);
  }


  lastSettingName(firstPart: any) {
    let length = firstPart.length;
    this.lastSetting = firstPart[length - 1].name;
  }

  closeFromGrattudeView(close: boolean) {
    this.receivedFromUserProfile = close;
  }

  ngAfterViewChecked() {

    this.cdRef.detectChanges();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

}
