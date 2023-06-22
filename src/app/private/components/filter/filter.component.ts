import { Component, EventEmitter, Input, OnInit, Output, SimpleChange } from '@angular/core';
import { IGratitudeByGroup } from '../../interfaces/i-gratitudes';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent implements OnInit {

  readonly months: string[] = ["January", "February", "March", "April", "May", "Jun", "July", "August", "September", "October", "November", "December"];
  monthsToUse?: string[];
  date = new Date;
  activeMonth: boolean = false;
  activeYear: boolean = false;
  monthNow = this.date.getMonth();
  @Output() filterValue = new EventEmitter<string>();

  @Input() collection?: any[];

  @Input() allGratitudes?: IGratitudeByGroup[];
  @Input() pie: boolean = false;



  monthsExisting: number[] = [];
  monthsInYear?: number[];
  yearsExisting?: any;
  yearNow = new Date().getFullYear();
  dropDownMonth: string = new Date().toLocaleString('default', { month: 'long' });
  dropDownYear: any = new Date().getFullYear();


  constructor() { }

  ngOnInit(): void {


  }

  ngOnChanges(changes: SimpleChange) {


    if (this.collection!.length >= 1) {
      let collectionByYear = this.filterByYear(this.collection);
      this.monthsExisting = this.filterMonths(collectionByYear);
      this.monthsToUse = this.monthsToDisplay(this.monthsExisting);
      this.yearsExisting = this.collection?.map(element => new Date(element.created_at || "").getFullYear())
        .filter((value, index, self) =>
          self.indexOf(value) === index);
      ///U ODNOSU NA VREDNOSTI NAPRAVITI 
      this.dropDownYear = this.yearsExisting[0];
    }
    if (this.pie) {
      this.dropDownMonth = "Full Year";
    }
    else {
      this.dropDownMonth = String(this.monthsToUse?.reverse()[0]);
    }

  }

  emitValue(element: any) {
    let valueToEmit = element.value;
    if (isNaN(element.value) && element.value != 'latest' && element.value != "oldest") {
      this.dropDownMonth = element.value;
    }
    else if (element.value === "oldest") {
      ///OVDE MORA HVATATI NAJSTARIJU GODINU I MESECE TE GODINE
      let tmpMonth = this.oldestMonth(this.collection);
      this.dropDownMonth = this.months[tmpMonth];
      let tmpYear = this.oldestYear(this.collection);
      this.dropDownYear = tmpYear;
      let tmpCollection = this.filterByYear(this.collection, Number(tmpYear));
      let tmp = this.filterMonths(tmpCollection);
      let months = this.monthsToDisplay(tmp);
      this.monthsToUse = months;
    }
    else if (element.value === "latest") {
      let tmpMonth = this.latestMonth(this.collection);
      this.dropDownMonth = this.months[tmpMonth];
      let tmpYear = this.latestYear(this.collection);
      this.dropDownYear = tmpYear;
      let tmpCollection = this.filterByYear(this.collection, Number(tmpYear));
      let tmp = this.filterMonths(tmpCollection);
      let months = this.monthsToDisplay(tmp);
      this.monthsToUse = months;
    }
    else if (!isNaN(element.value)) {
      this.dropDownYear = element.value;

      if (valueToEmit != this.yearNow) {
        let tmpCollection = this.filterByYear(this.collection, Number(valueToEmit));
        let tmp = this.filterMonths(tmpCollection);
        let months = this.monthsToDisplay(tmp);
        this.monthsToUse = months;
        let tmpMonth = this.latestMonth(tmpCollection);
        if (!this.pie) {
          this.dropDownMonth = this.months[tmpMonth];
        }
        else {
          this.dropDownMonth = "Full Year";
        }
      }
      else {
        let tmpCollection = this.filterByYear(this.collection, Number(valueToEmit));
        let tmp = this.filterMonths(tmpCollection);
        let months = this.monthsToDisplay(tmp);
        this.monthsToUse = months;
        let tmpMonth = this.latestMonth(tmpCollection);
        if (!this.pie) {
          this.dropDownMonth = this.months[tmpMonth];
        }
        else {
          this.dropDownMonth = "Full Year";
        }
      }
    }

    this.filterValue.emit(valueToEmit);
  }

  filterByYear(collection: any, year?: any) {
    this.activeYear = true;
    let lastLoggedYear = new Date(collection[0].created_at).getFullYear();
    let tmp: any = [];
    if (year) {
      tmp = collection?.filter(function (el: any) {
        let yearCollection = new Date(el.created_at).getFullYear();
        return yearCollection === year
      });
    }
    else if (this.yearNow == lastLoggedYear) {
      tmp = collection?.filter(function (el: any) {
        let year = new Date(el.created_at).getFullYear();
        let yearNow = new Date().getFullYear();
        return year === yearNow
      });
    }
    else {
      tmp = collection?.filter(function (el: any) {
        let year = new Date(el.created_at).getFullYear();
        return year === lastLoggedYear
      });
    }
    return tmp;
  }

  filterMonths(collectionByYear: any) {
    let tmp = collectionByYear?.
      map((element: any) => new Date(element.created_at || "").getMonth())?.
      filter((x: any, i: any, a: any) => a.indexOf(x) == i);
    return tmp;
  }

  monthsToDisplay(monthsExisting: any[]) {

    let tmp = this.months.
      filter((e, i, a) => monthsExisting.
        includes(i));

    return tmp;
  }

  oldestMonth(collection: any) {
    let oldest = [...collection!].pop();
    let oldestMonth = new Date(oldest.created_at || "").getMonth();
    return oldestMonth;
  }

  oldestYear(collection: any) {
    let oldest = [...collection!].pop();
    let oldestYear = new Date(oldest.created_at || "").getFullYear();
    return oldestYear;
  }

  latestMonth(collection: any) {
    let latest = ([...collection!].reverse()).pop();
    let latestMonth = new Date(latest.created_at || "").getMonth();
    return latestMonth;
  }

  latestYear(collection: any) {
    let latest = ([...collection].reverse()).pop();
    let latestYear = new Date(latest.created_at || "").getFullYear();
    return latestYear;
  }

}
