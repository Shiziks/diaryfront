import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faCaretLeft } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { WaterService } from '../../services/water.service';

@Component({
  selector: 'app-waterintake-view',
  templateUrl: './waterintake-view.component.html',
  styleUrls: ['./waterintake-view.component.css']
})
export class WaterintakeViewComponent implements OnInit, OnDestroy {

  waterGlasses: string[] = ["One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight"]; //broj casa izvucen iz baze
  waterLogs: any[] = []; //zapis o svim unosima vode
  allWaterLogs: any[] = [];
  valueLine: string = ""; //vrednost koja se prosledjuje Line Chartu
  valuePie: string | number = ""; //vrednost koja se salje Pie Chartu
  pie: boolean = true; //da ne prikaze kod pie sve filtere
  icon = faCaretLeft;
  user_id: number = 0;
  currentYear = new Date().getFullYear();
  currentMonth = new Date().getMonth(); //broj za jedan manji od sadasnjeg meseca
  sub!: Subscription;

  noData: string = '';

  constructor(private router: Router, private waterService: WaterService) { }

  ngOnInit(): void {
    this.user_id = Number(localStorage.getItem('user_id'));
    this.sub = this.waterService.getAllUserWaterLogs(this.user_id).subscribe({
      next: result => {
        if (result.data.length > 0) {
          this.allWaterLogs = [...result.data];
          ///filtriranje za podatke koji se inicajlno prikazuju
          ///mapiranje tako da radi u chart komponentama
          this.waterLogs = result.data.map((element: any) => {
            return {
              mood_id: element.waterglass_id,
              user_id: element.user_id,
              mood_name: element.glass_number,
              created_at: element.created_at
            }
          })
        }
        else {
          this.noData = "To see the history of your water intakes you have to start logging them first.";
        }

      },
      error: er => {
        console.log(er);
      }
    });


  }

  goBack() {
    this.router.navigate(['profile']);
  }

  getEmitedValueLineChart(value: any) {
    this.valueLine = value;
  }

  getEmitedValuePieChart(value: string | number) {
    this.valuePie = value;
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }
}
