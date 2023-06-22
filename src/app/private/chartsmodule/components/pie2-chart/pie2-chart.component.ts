import { Component, Input, OnInit, SimpleChange, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-pie2-chart',
  templateUrl: './pie2-chart.component.html',
  styleUrls: ['./pie2-chart.component.css']
})
export class Pie2ChartComponent implements OnInit {

  @Input() collection: any[] = [];
  @Input() filterValue: string = '';
  userWorkouts: any[] = [];

  private currentYear = (new Date()).getFullYear();
  title: string = "Year " + this.currentYear;
  yearFilter: number = this.currentYear;

  colors: string[] = [
    'rgba(247, 199, 161, 0.7)',
    'rgba(118, 123, 145, 0.7)', //boja za svaki slajs po redu
  ];

  months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  pieChartData: any;
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;


  constructor() { }

  ngOnInit(): void {
  }


  public pieChartOptions: ChartConfiguration['options'] = {
    layout: {
      padding: {
        bottom: 15
      }
    },
    responsive: true,
    plugins: {
      tooltip: {
        backgroundColor: 'rgba(42, 50, 75, 0.8)',
        callbacks: {
          title: function (chart: any) {
            return chart[0].label
          },
          label: function (chart: any) {
            let val = chart.parsed;
            let arr = chart.dataset.data;
            let sum = arr.reduce(function (a: any, b: any) { return a + b; }, 0);
            let percentage = (val * 100 / sum).toFixed(2) + "%";
            return percentage;
          }
        }
      },
      title: {
        display: true,
        font: {
          size: 18,
        },
        color: 'rgba(118, 123, 145, 0.8)',
        text: this.title,
        padding: {
          top: 0,
          bottom: 20
        }
      },
      legend: {
        onClick: function () { },
        display: true,
        position: 'top',
        labels: {
          padding: 15
        },
      },
      datalabels: {
        display: false,
        formatter: (value: any, ctx: any) => {
          if (ctx.chart.data.labels) {
            return ctx.chart.data.labels[ctx.dataIndex];
          }
        },
      },
    }
  }
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;



  ngOnChanges(changes: SimpleChange) {
    if (this.collection.length != 0 && this.filterValue !== "") {
      this.userWorkouts = [...this.collection];
      this.pieChartData = this.generateChartData(this.userWorkouts, this.filterValue);
      this.title = this.generateTitle(this.filterValue);
      this.pieChartOptions!.plugins!.title!.text = this.title;
      this.chart?.chart?.update();
    }
    else if (this.collection.length != 0 && this.filterValue == "") {
      this.userWorkouts = [...this.collection];
      let lastLoggedYear = new Date(this.userWorkouts[0].created_at).getFullYear();
      this.pieChartData = this.generateChartData(this.userWorkouts, lastLoggedYear);
      if (lastLoggedYear != this.currentYear) {
        this.title = "Year " + lastLoggedYear;
      }
      this.pieChartOptions!.plugins!.title!.text = this.title;
      this.chart?.chart?.update();

    }

  }

  generateChartData(collection: any, value: any = this.currentYear) {
    let tmpData = this.formatChartData(collection, value);
    let tmp = {
      labels: ["Wrkedout", "Didn't workout"],
      datasets: [{
        data: tmpData,
        backgroundColor: this.colors,
        hoverOffset: 20,
        borderColor: ['rgba(108,117,122, 0.7)'],
        borderWidth: 1,
        borderJoinStyle: 'bevel'
      },
      ],
    };
    return tmp;
  }


  formatChartData(collection: any, value?: any) {
    let collectionbyYear;
    if (isNaN(value)) {
      let dataArray: any[] = [];
      collectionbyYear = collection.filter((element: any) => {
        let tmpyear = new Date(element.created_at).getFullYear();
        if (tmpyear === Number(this.yearFilter)) {
          return element;
        }
      });
      let valueMonth = this.months.indexOf(value);
      let collectionByMonth = collectionbyYear.filter((element: any) => {
        let tmpMonth = new Date(element.created_at).getMonth();
        if (tmpMonth === valueMonth) {
          return element;
        }
      });
      let total = this.daysInMonth(this.yearFilter, valueMonth);
      let workout = collectionByMonth.length;
      let noWorkout = total - workout;
      dataArray = this.populateArray(dataArray, workout, noWorkout);
      return dataArray;
    }
    else {
      this.yearFilter = value;
      let dataArray: any = [];
      let collectionbyYear = collection.filter((element: any) => {
        let tmpyear = new Date(element.created_at).getFullYear();
        if (tmpyear === Number(value)) {
          return element;
        }
      });
      if (value == this.currentYear) {
        let x = this.days_passed();
        let noWorkout = x - collectionbyYear.length;
        let workout = collectionbyYear.length;
        dataArray = this.populateArray(dataArray, workout, noWorkout);
        return dataArray;
      }
      else {
        let tmp = this.daysInYear(value);
        let workout = collectionbyYear.length;
        let noWorkout = tmp - workout;
        dataArray = this.populateArray(dataArray, workout, noWorkout);
        return dataArray;
      }
    }
  }

  generateTitle(filterValue: any) {
    let title;
    if (filterValue != "") {
      if (this.months.indexOf(String(filterValue)) >= 0) {
        title = filterValue + " " + this.yearFilter;
      }
      else {
        title = "Year " + filterValue;
      }
    }
    else {
      title = "Year " + this.currentYear;
    }
    return title;
  }

  days_passed() {
    let now = new Date();
    let start = new Date(now.getFullYear(), 0, 0);
    let diff = (Number(now) - Number(start)) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
    let oneDay = 1000 * 60 * 60 * 24;
    let day = Math.floor(diff / oneDay);
    return day;
  }


  daysInYear(year: any) {
    let tmp = ((year % 4 === 0 && year % 100 > 0) || year % 400 == 0) ? 366 : 365;
    return tmp;
  }

  daysInMonth(year: number, month: number) {
    let tmp = new Date(year, month, 0).getDate();
    return tmp;
  };

  populateArray(dataArray: number[], workout: number, noWorkout: number) {
    dataArray.push(workout);
    dataArray.push(noWorkout);
    return dataArray;
  }
}


