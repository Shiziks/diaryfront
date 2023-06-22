// <ng-container *ngIf="!isAuth">
// <div class="container"> 
//     <section class='login' id='login'>
//         <div class='head'>
//         <h1 class='company'>Universe Explorer</h1>
//         </div>
//         <p class='msg'>Welcome back</p>
//         <div class='form'>
//         <form [formGroup]="formRegister">
//         <br >
//         <input type="text" placeholder='First Name' class='text' id='firstName' required formControlName="firstnameTs"><br>

//         <input type="text" placeholder='Last Name' class='second' id='lastName' required formControlName="lastnameTs"><br>
//         <div class="secondradio">
//             <label>Gender:</label>
//             <input type="radio" class="genderradio" formControlName="genderTs"  value="f"> Femail
//             <input type="radio" class="genderradio" formControlName="genderTs"  value="m"> Male
//             <input type='radio' class="genderradio" formControlName="genderTs"  value="o">Other 
//         </div>

//         <div class="secondradio">
//             <label for="start">Birth date:</label>
//             <input type="date" id="start" name="trip-start" value="2018-07-22" min="1920-01-01" max="2018-12-31" formControlName="dateTs">
//         </div>
     

//         <input type="text" placeholder='Email' class='second' id='email' required formControlName="emailTs"><br>
        
        
//         <input type="password" placeholder='Enter password' class='second ' formControlName="passwordTs"><br>

//         <input type="password" placeholder='Repeate the password' class='password ' formControlName="password1Ts"><br>

   

//         <button class='btn btn-login' id='do-login' (click)="register()">Login</button>
//         <a href="#" class='forgot'>Forgot?</a>
//           </form>
//         </div>
//     </section>
//     </div>
// </ng-container>