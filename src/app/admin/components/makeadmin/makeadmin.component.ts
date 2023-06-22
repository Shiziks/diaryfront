import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { IUser } from 'src/app/shared/interfaces/i-user';
import { AuthService } from 'src/app/shared/services/auth.service';
import { UserDataService } from 'src/app/shared/services/user-data.service';

@Component({
  selector: 'app-makeadmin',
  templateUrl: './makeadmin.component.html',
  styleUrls: ['./makeadmin.component.css']
})
export class MakeadminComponent implements OnInit, OnDestroy {

  subtitle: string = "Search for an existing user:";
  smallText: string = "Make new admin user";
  emailForm!: FormGroup;
  newAdminUserForm!: FormGroup;
  emailpattern: string = "^[^\\s@]+@([^\\s@.,]+\.)+[^\\s@.,]{2,}$";
  showUserData: boolean = false;
  user: any;
  roles: any;
  noClick: boolean = false;
  newUser: boolean = false;
  existingRoles?: any[];
  adminRole: boolean = true;
  userRole: number = 0;
  message: string = '';
  sub: Subscription[] = [];
  erMessage:string="";

  constructor(private userService: UserDataService, private authService: AuthService) {
    this.emailForm = new FormGroup({
      emailTs: new FormControl('', [Validators.required, Validators.email, Validators.pattern(this.emailpattern)])
    });
    this.newAdminUserForm = new FormGroup({
      firstNameTs: new FormControl("", [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(30),
        Validators.pattern("^([a-zA-Z',.-]+([a-zA-Z',.-]+)*){2,30}$")]),
      lastNameTs: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(30),
        Validators.pattern("^([a-zA-Z',.-]+( [a-zA-Z',.-]+)*){2,30}$"),]),
      emailTs: new FormControl('', [
        Validators.required,
        Validators.email, //mora imati patern za email
        Validators.pattern(this.emailpattern)]),
      passwordTs: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(30),
        Validators.pattern('^(?=.*\\d)(?=.*[a-zA-Z])(?=.*[A-Z])(?=.*[-\\#\\$\\.\\%\\&\\*])(?=.*[a-zA-Z]).{8,30}$'),//dodati patern za password
      ]),
    });

  }

  ngOnInit(): void {

    ////IZVUCI ROLE IZ BAZE
    let sub1 = this.userService.getRoles().subscribe({
      next: result => {
        this.existingRoles = result;
        result.forEach((role: any) => {
          if (role.name == 'admin') {
            this.newAdminUserForm.addControl(role.name, new FormControl('', Validators.required));
          }
          else {
            this.newAdminUserForm.addControl(role.name, new FormControl('', Validators.nullValidator));
          }
          this.newAdminUserForm.get(role.name)?.setValue(role.name);
        });
      },
      error: er => {
        console.log(er);
      }
    });
    this.sub.push(sub1);
  }

  searchEmail() {
    let email = this.emailForm.get('emailTs')?.value;
    if (email != "") {
      let sub2 = this.userService.searchForUser(email).subscribe({
        next: result => {
          this.user = result.user;
          this.roles = result.roles;
          this.showUserData = true;
          result.roles.forEach((role: any) => {
            if (role.role_name == 'admin') {
              this.noClick = true;
            }
          });

        },
        error: er => {
          console.log(er);
          console.log("Ovde sam");
          this.showUserData = false;
          this.erMessage=email+" can't be found.";
          this.emailForm.reset();
          this.emailForm.markAsPristine();
          setTimeout(()=>{
            this.erMessage='';
          }, 3000);
        }
      });
      this.sub.push(sub2);
    }
  }

  makeAdmin(data: any) {
    let id = {
      'id': data.id
    }
    let sub3 = this.userService.makeAdmin(id).subscribe({
      next: result => {
        this.roles = result;
        result.forEach((role: any) => {
          if (role.role_name == 'admin') {
            this.noClick = true;
          }
        });
      },
      error: er => {
        console.log(er);
      }
    });
    this.sub.push(sub3);
  }

  deleteAdmin(data: any, roles: any) {
    let user_id = 0;
    let role_id = 0;
    if (roles.length > 0) {
      user_id = roles[0].user_id;
      roles.forEach((role: any) => {
        if (role.role_name == 'admin') {
          role_id = role.role_id;
        }
      });

      if (user_id > 0 && role_id > 0) {
        let data = {
          'user_id': user_id,
          'role_id': role_id
        }
        let sub4 = this.userService.removeAdminRole(data).subscribe({
          next: result => {
            this.roles = result;
          },
          error: er => {
            console.log(er);
          }
        });
        this.sub.push(sub4);
      }
    }


  }


  /////MAKE NEW ADMIN USER
  showMakeNewUser() {
    if (!this.newUser) {
      this.newUser = true;
      this.subtitle = "Make new admin user:";
      this.smallText = "Search for an existing user";
    }
    else {
      this.newUser = false;
      this.subtitle = "Search for an existing user:";
      this.smallText = "Make new admin user"
    }

  }

  /////CREATE USER
  createUser() {
    let first_name = this.newAdminUserForm.get('firstNameTs')?.value;
    let last_name = this.newAdminUserForm.get('lastNameTs')?.value;
    let email = this.newAdminUserForm.get('emailTs')?.value;
    let password = this.newAdminUserForm.get('passwordTs')?.value;
    let dataToSend: { [key: string]: any } = {
      'first_name': first_name,
      'last_name': last_name,
      'email': email,
      'password': password,
    }
    let roles: any[] = [];
    for (let i = 0; i < this.existingRoles!.length; i++) {
      if (this.newAdminUserForm.get(this.existingRoles![i].name)?.value != false) {
        roles.push({
          'name': this.existingRoles![i].name,
          'id': this.existingRoles![i].id
        });
      }
    }

    dataToSend['roles'] = roles;
    this.message = "* Please wait..."
    let sub5 = this.authService.register(dataToSend as IUser).subscribe({
      next: result => {
        this.message = "* New admin user successfully created."
        this.newAdminUserForm.reset();
        this.newAdminUserForm.markAsPristine();
        this.newAdminUserForm.get('admin')?.setValue('admin');
        setTimeout(() => {
          this.message = '';
        }, 3000);
      },
      error: er => {
        console.log(er);
        this.message = "* Ooops, something went wrong. Please check all input fields and try again."
        setTimeout(() => {
          this.message = '';
        }, 4000);
      }
    });
    this.sub.push(sub5);

  }

  ////CHECKBOX CHANGE
  onChange(event: any, role: any) {
    if (event.target.checked == false && role.name == 'admin') {
      this.adminRole = false;
    }
  }

  ngOnDestroy(): void {
    if (this.sub.length > 0) {
      this.sub.forEach((subscription) => subscription.unsubscribe());
    }
  }
}
