import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faCaretLeft } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { EnergiesService } from '../../services/energies.service';
import { LogService } from '../../services/log.service';

@Component({
  selector: 'app-energy-view',
  templateUrl: './energy-view.component.html',
  styleUrls: ['./energy-view.component.css']
})
export class EnergyViewComponent implements OnInit, OnDestroy {

  valueLine: string = "";
  icon = faCaretLeft;
  pie: boolean = true;
  userEnergies: any[] = [];
  energies: any = []; //iz baze izvuceni nivoi energije
  valuePie: any = ''; //emitovana vrednost prilikom izbora iz filtera
  collection: any[] = [];//isfiltrirana vrednost
  currentUserEnergies: any = [];
  year = new Date().getFullYear();
  sort: any;
  reversed: boolean = false;
  energyUserYear: any[] = [];
  noData: string = '';
  sub: Subscription[] = [];

  constructor(private router: Router, private logService: LogService, private energyService: EnergiesService) { }

  ngOnInit(): void {
    const user_id = Number(localStorage.getItem('user_id'));
    let sub1 = this.logService.getEnergies().subscribe({
      next: result => {
        let obj = result.data;
        let tmp = obj.map((element: any) => {
          let name = element.energy_name.charAt(0).toUpperCase() + element.energy_name.slice(1);
          return name;
        });
        this.energies = tmp.reverse();
      },
      error: er => {
        console.log(er.message);
      }
    });
    this.sub.push(sub1);
    let sub2 = this.energyService.getAllUserEnergies(user_id).subscribe({
      next: result => {
        if (result.data.length > 0) {
          let tmp = result.data;
          this.userEnergies = tmp.map((element: any, index: any) => {
            return {
              mood_id: element.energy_id,
              user_id: element.user_id,
              mood_name: element.energy_name,
              created_at: element.created_at
            }
          });
          this.sub.push(sub2);
          this.collection = [...this.userEnergies];
        }
        else {
          this.noData = "To see the history of your energies you have to start logging them first."
        }
      },
      error: er => {
        console.log(er.message);
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
    if (this.sub.length > 0) {
      this.sub.forEach((subscription) => subscription.unsubscribe());
    }
  }
}
