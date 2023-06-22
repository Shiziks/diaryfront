
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faBatteryFull, faBatteryThreeQuarters, faBatteryHalf, faBatteryQuarter, faBatteryEmpty } from '@fortawesome/free-solid-svg-icons';
import { LogService } from '../../services/log.service';
import { Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'app-energy-log',
  templateUrl: './energy-log.component.html',
  styleUrls: ['./energy-log.component.css']
})
export class EnergyLogComponent implements OnInit, OnDestroy {

  linkText: string = "All your past Energies"

  eicon1: any;
  eicon2: any;
  eicon3: any;
  eicon4: any;
  eicon5: any;

  energy = true;
  mood = false;

  userenergy_id: any;

  @Output() emitChange = new EventEmitter<any>();

  title = "Energy log:";
  subtitle = "My energy level today is:"

  res: any;

  sub1: any;
  sub2: any;


  constructor(private energyService: LogService, private router: Router) { }

  ngOnInit(): void {
    this.sub1 = this.energyService.getEnergies().subscribe({
      next: result => {
        this.res = result.data.reverse();
      },
      error: er => {
        console.log(er); //handle greske ako se ne upisu svi moods jer baza ne radi
        this.router.navigate(['mistake']);
      }
    });

    let userId = localStorage.getItem('user_id');
    if (userId) {
      this.sub2 = this.energyService.getCurrentEnergy(userId).subscribe({
        next: result => {
          if (result !== null) {
            if (result.energy_id) {
              localStorage.setItem("currentenergy_id", result.energy_id);
              this.userenergy_id = result.energy_id;
            }
          }
          else {
            localStorage.removeItem('currentenergy_id');
          }
        },
        error: er => {
          console.log(er);
        }
      });
    }
  }

  ngOnDestroy() {
    this.sub1.unsubscribe();
    this.sub2.unsubscribe();
  }

  changeEmitted(event: any) {
    let data = event;
    this.emitChange.emit(data);
  }



}
