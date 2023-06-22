import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { IDayLog } from '../../interfaces/i-day-log';
import { CloseViewService } from '../../services/close-view.service';
import { DaylogEditService } from '../../services/daylog-edit.service';



@Component({
  selector: 'app-day-log',
  templateUrl: './day-log.component.html',
  styleUrls: ['./day-log.component.css']
})

export class DayLogComponent implements OnInit {

  p: number = 1;
  collection: IDayLog[] = [];
  dayLogInfoToShare?: IDayLog;
  sort: any;
  reversed: boolean = false;
  noData: string = '';

  @Input() allDayLogs: IDayLog[] = [];

  user_id = localStorage.getItem('user_id');

  constructor(
    private router: Router,
    private daylogeditservice: DaylogEditService,
    private closeView: CloseViewService
  ) { }

  ngOnInit(): void {

  }


  ngOnChanges() {
    if (this.allDayLogs.length > 0) {
      this.collection = this.allDayLogs;
      this.noData = '';
    }
    else {
      this.noData = "All your past Day Logs will be shown here once you start logging them."
    }
  }


  getEmitedValue(value: any) {
    this.p = 1;
    this.collection = this.allDayLogs;
    this.sort = value;
    if (isNaN(value)) {
      if (value == "oldest") {
        this.reversed = true;
        let tmp = this.collection.slice().reverse();
        this.collection = tmp;
      }
      else if (value == "latest" && this.reversed) {
        this.collection = this.collection;
      }
      else {
        this.filterMonth(value);
      }
    }
    else {
      this.filterYear(value);
    }
  }


  filterMonth(monthvalue: string) {
    this.collection = this.allDayLogs;
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let monthNum = months.findIndex(month => month == monthvalue);

    let tmp = this.collection.filter(daylog => {
      let date = new Date(daylog.created_at || "");
      let month = date.getMonth();
      return month == monthNum;
    });

    this.collection = tmp;
  }

  filterYear(yearValue: number) {
    this.collection = this.allDayLogs;
    let tmp = this.collection.filter(daylog => {
      let date = new Date(daylog.created_at || "");
      let year = date.getFullYear();
      return year == yearValue;
    });
    this.collection = tmp;
  }


  ////View and Edit Day Log
  viewEditDayLog(daylog: any) {
    this.dayLogInfoToShare = daylog;
    this.daylogeditservice.shareDayLog(daylog);
    this.router.navigate(['profile/daylog']); //implementirati Can Activate
  }


  /////CLOSE
  close() {
    this.closeView.emitClose(false);
  }
}
