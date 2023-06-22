import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { GratitudeService } from '../../services/gratitude.service';
import { map, Subscription } from 'rxjs';
import { CloseGratitudeViewService } from '../../services/close-gratitude-view.service';


@Component({
  selector: 'app-gratitudes-view',
  templateUrl: './gratitudes-view.component.html',
  styleUrls: ['./gratitudes-view.component.css']
})
export class GratitudesViewComponent implements OnInit, OnDestroy {

  @Input() allGratitudes: any[] = [];
  p: number = 1;
  sort: any;
  reversed: boolean = false;
  collection: any;
  noData = '';
  closeAlert: boolean = false;
  sub: Subscription[] = [];


  constructor(private gratitudeService: GratitudeService, private closeGratitudeView: CloseGratitudeViewService) {

  }

  ngOnInit(): void {
    const user_id = Number(localStorage.getItem('user_id'));

    let sub1 = this.gratitudeService.getUserGratitudesByGroup(user_id).subscribe({
      next: result => {
        if (result.length > 0) {
          this.allGratitudes = result;
          this.collection = [...result];
          this.noData = '';
        }
        else {
          this.noData = "To review all your past Gratitude logs you need to start logging first.";
        }

      },
      error: er => {
        console.log(er);
      }
    });
    this.sub.push(sub1);
  }

  ////Ovo je funkcija koja radi za filter
  getEmitedValue(value: any) {
    this.p = 1;
    this.allGratitudes = [...this.collection];
    this.sort = value;

    if (isNaN(value)) {
      if (value == "oldest") {
        this.reversed = true;
        let tmp = this.allGratitudes.slice().reverse();
        this.allGratitudes = tmp;
      }
      else if (value == "latest" && this.reversed) {
        this.allGratitudes = this.allGratitudes;
      }
      else {
        this.filterMonth(value);

      }
    }
    else {
      this.filterYear(value);
    }
  }

  filterMonth(value: string) {
    this.allGratitudes = [...this.collection];
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let monthNum = months.findIndex(month => month == value);

    let tmp = this.allGratitudes.filter((value: { created_at: any; }) => {
      let date = new Date(value.created_at || "");
      let month = date.getMonth();
      return month == monthNum;
    });

    this.allGratitudes = tmp;

  }

  filterYear(yearValue: number) {
    this.allGratitudes = this.collection;
    let tmp = this.collection.filter((gratitude: any) => {
      let date = new Date(gratitude.created_at || "");
      let year = date.getFullYear();
      return year == yearValue;
    });
    this.allGratitudes = tmp;
  }

  close() {
    this.closeGratitudeView.emitClose(false);
  }

  deleteGratitude(gratitude: any) {
    let user_id = localStorage.getItem('user_id');
    let group_id = gratitude.group_id;
    let data = {
      'group_id': group_id,
      'user_id': user_id
    }
    let sub2 = this.gratitudeService.deleteGratitudes(data).subscribe({
      next: res => {
        this.allGratitudes = this.allGratitudes.filter((gratitude: any) => {
          if (gratitude.group_id !== group_id) {
            return gratitude;
          }
        });
      },
      error: er => {
        console.log(er);
        this.closeAlert = true;
      }
    });
    this.sub.push(sub2);
  }

  ngOnDestroy() {
    if (this.sub.length > 0) {
      this.sub.forEach((subscription) => subscription.unsubscribe());
    }
  }
}
