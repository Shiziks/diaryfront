import { Component, Input, OnInit, SimpleChange, ViewChild } from '@angular/core';
import DatalabelsPlugin from 'chartjs-plugin-datalabels';
import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { IUsermoods } from 'src/app/private/interfaces/i-usermoods';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.css']
})
export class PieChartComponent implements OnInit {

  @ViewChild(BaseChartDirective) piechart: BaseChartDirective | undefined;


  @Input() collection: IUsermoods[] = [];
  @Input() moods: string[] = [];
  @Input() filterValue: string | number = '';
  dataArray: number[] = [];
  dataCollection: IUsermoods[] = [];


  private currentYear = (new Date()).getFullYear();
  title: string = "Year " + this.currentYear;
  yearFilter: number = this.currentYear;

  colors: string[] = [
    'rgba(42, 50, 75, 0.7)', //boja za svaki slajs po redu
    'rgba(118, 123, 145, 0.7)',
    'rgba(199, 204, 219, 0.7)',
    'rgba(225, 229, 238, 0.7)',
    'rgba(245, 187, 142, 0.7)',
    'rgba(247, 199, 161, 0.7)',
    'rgba(249, 209, 178,0.7)',
    'rgba(250, 213, 185, 0.7)',
  ];

  pieChartData?: any;
  months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

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
        color: 'slategray',
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
  public pieChartPlugins = [DatalabelsPlugin];
  public pieChartLegend = true;


  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChange) {
    if (this.collection.length != 0 && this.filterValue != "") {
      this.dataCollection = [...this.collection];
      this.pieChartData = this.generateChartData(this.dataCollection, this.filterValue);
      this.title = this.generateTitle(this.filterValue);
      this.pieChartOptions!.plugins!.title!.text = this.title;
      this.piechart?.chart?.update();
    }
    else if (this.collection.length != 0 && this.filterValue == "") {
      this.dataCollection = [...this.collection];
      let lastLoggedYear = new Date(this.dataCollection[0].created_at).getFullYear();
      this.pieChartData = this.generateChartData(this.dataCollection, lastLoggedYear);
      if (lastLoggedYear != this.currentYear) {
        this.title = "Year " + lastLoggedYear;
      }
      this.pieChartOptions!.plugins!.title!.text = this.title;
      this.piechart?.chart?.update();
    }
  }

  generateChartData(collection: any, value: any = this.currentYear) {
    let tmpData = this.formatChartData(collection, value);
    let tmp = {
      labels: this.moods,
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

  ///////////////////////////////////////////////////////////////////////////////////////////////

  formatChartData(collection: any, value?: any) {
    let collectionbyYear;
    if (isNaN(value)) {
      let dataArray = [];
      let tmp = [];
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
      for (let i = 0; i < this.moods.length; i++) {
        tmp = collectionByMonth.filter((element: any) => {
          if (element.mood_name.toLowerCase() === this.moods[i].toLowerCase()) {
            return element;
          }
        });
        dataArray.push(tmp.length);
      }
      return dataArray;
    }
    else {
      this.yearFilter = value;
      let dataArray: any = [];
      let tmp: any;
      let collectionbyYear = collection.filter((element: any) => {
        let tmpyear = new Date(element.created_at).getFullYear();
        if (tmpyear === Number(value)) {
          return element;
        }
      });
      for (let i = 0; i < this.moods.length; i++) {
        tmp = collectionbyYear.filter((element: any) => {
          if (element.mood_name.toLowerCase() === this.moods[i].toLowerCase()) {

            return element;
          }
        });
        dataArray.push(tmp.length);
      }
      return dataArray;
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
}
