import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { faCaretLeft } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { MoodService } from '../../services/mood.service';
import { LogService } from '../../services/log.service';
import { IUsermoods } from '../../interfaces/i-usermoods';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-moods-view',
  templateUrl: './moods-view.component.html',
  styleUrls: ['./moods-view.component.css']
})

export class MoodsViewComponent implements OnInit, OnDestroy {

  icon=faCaretLeft;
  pie:boolean=true;
  monthDays:any;
  moods:string[]=[];
  userMoods:IUsermoods[]=[];
  userMoodsYear:IUsermoods[]=[];
  valuePie:string|number="";

  collection:IUsermoods[]=[];
  year:number=new Date().getFullYear();
  valueLine:string="";
 
  
  sort:any;
  reversed:boolean=false;
  noData:string='';
  sub:Subscription[]=[];

  constructor(
    private router:Router , 
    private moodService:MoodService,
    private logService:LogService,
    
    ) { }

  ngOnInit(): void {
    const user_id=Number(localStorage.getItem('user_id'));
    if(user_id){
      let sub1=this.moodService.getAllUserMoods(user_id).subscribe({
        next: result=>{ 
          if(result.data.length>0){
            this.userMoods=[...result.data]; ///promenljiva koja cuva ceo niz
            this.collection=[...result.data];
          }
          else{
            this.noData="To review the history of your moods you have to start logging them first."
          }
        },
        error: er=> {
          console.log(er);
        }
      });
      this.sub.push(sub1);
    }
    else{
      this.router.navigate(['/mistake']);
    }
    

    ///POSTOJECE MOODS U BAZI
    let sub2=this.logService.getMoods().subscribe({
      next: result=>{
        let tmp=result.data;
        ////Mapiranje rezultata u niz raspolozenja sa pocetnim velikim slovom
        let arr=tmp.map((item:any)=>{
          let uc=item.mood_name.charAt(0).toUpperCase() + item.mood_name.slice(1);
          return uc;
        });
        this.moods=arr.reverse();
      },
      error: er=>{
        console.log(er.message);
        this.router.navigate(['/mistake']);
      }
    });
    this.sub.push(sub2);
  }

  goBack(){
    this.router.navigate(['profile']);
  }

  getEmitedValueLineChart(value:any){
    this.valueLine=value;
  }

  getEmitedValuePieChart(value:string|number){
    this.valuePie=value;
  }

  ngOnDestroy(){
    if(this.sub.length>0){
      this.sub.forEach((subscription) => subscription.unsubscribe());
    }
  }
}
