import { Component, OnInit } from '@angular/core';
import { faBatteryFull, faWater, faGlassWater, faGlassWaterDroplet } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-tracker',
  templateUrl: './tracker.component.html',
  styleUrls: ['./tracker.component.css']
})
export class TrackerComponent implements OnInit {

  icon = faGlassWaterDroplet;

  constructor() { }

  ngOnInit(): void {
  }

}
