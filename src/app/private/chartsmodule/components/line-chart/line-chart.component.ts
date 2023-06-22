import { Component, Input, OnInit, SimpleChange, SimpleChanges, ViewChild } from '@angular/core';
import { IUsermoods } from 'src/app/private/interfaces/i-usermoods';



@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css']
})
export class LineChartComponent implements OnInit {

  @Input() moods: string[] = [];
  @Input() userMoods: IUsermoods[] = [];
  @Input() filterValue: string = "";


  collection: any;

  colors: string[] = [
    'rgba(42, 50, 75, 0.7)', //boja za svaki slajs po redu
    'rgba(118, 123, 145, 0.7)',
    'rgba(199, 204, 219, 0.7)',
    'rgba(245, 187, 142, 0.7)',
    'rgba(247, 199, 161, 0.7)',
    'rgba(249, 209, 178, 0.7)'
  ];

  private months = ['January', 'February', 'March', 'April', 'May', 'Jun', 'July', 'August', 'September', 'October', 'November', 'December'];
  currentMonth: any;

  lineChartDatasets: any[] = [];
  lineChartLabels!: number[];
  lineChartOptions: any;

  lineChartLegend = true;
  lineChartPlugins = [];
  lineChartType = 'line';
  year = new Date().getFullYear();
  month = new Date().toLocaleString('en-US', { month: 'long' });
  selectedYear: number = 0;


  constructor() { }

  ngOnInit(): void {

  }


  ngOnChanges(changes: SimpleChanges) {
    this.collection = [...this.userMoods];
    let userMoods;
    let tmpUserMoods;
    if (this.moods.length != 0 && this.userMoods.length != 0) {
      if (this.filterValue == "") {
        let tmpLastLoggedYear = new Date(this.userMoods[0].created_at).getFullYear();
        let tmpLastLoggedMonth = new Date(this.userMoods[0].created_at).toLocaleString('en-US', { month: 'long' });
        if (tmpLastLoggedYear === this.year) {
          tmpUserMoods = this.filterYear(this.year);
        }
        else {
          tmpUserMoods = this.filterYear(tmpLastLoggedYear);
        }
        userMoods = this.filterMonth(tmpLastLoggedMonth, tmpUserMoods);
        this.generateChart(userMoods, this.moods);
      }
      else if (this.filterValue !== "") {
        if (Number(this.filterValue)) {

          this.selectedYear = Number(this.filterValue);
          let tmpUserMoods = this.filterYear(this.selectedYear);
          let tmpMonth = new Date(tmpUserMoods[0].created_at).toLocaleString('en-US', { month: 'long' });
          userMoods = this.filterMonth(tmpMonth, tmpUserMoods);
          this.generateChart(userMoods, this.moods);
        }
        else if (this.filterValue == 'oldest') {

          let tmpUserMoodsDESC = ([...this.collection]).reverse();
          this.selectedYear = new Date(tmpUserMoodsDESC[0].created_at).getFullYear();
          let tmpUserMoodsYear = this.filterYear(this.selectedYear);
          let tmpMonth = new Date(tmpUserMoodsYear[0].created_at).toLocaleString('en-US', { month: 'long' });
          userMoods = this.filterMonth(tmpMonth, tmpUserMoodsYear);
          this.generateChart(userMoods, this.moods);
        }
        else if (this.filterValue == 'latest') {
          this.selectedYear = 0;
          let lastLoggedYear = new Date(this.userMoods[0].created_at).getFullYear();
          let tmpUserMoodsYear = this.filterYear(lastLoggedYear);
          let tmpMonth = new Date(tmpUserMoodsYear[0].created_at).toLocaleString('en-US', { month: 'long' });
          userMoods = this.filterMonth(tmpMonth, tmpUserMoodsYear);
          this.generateChart(userMoods, this.moods);
        }
        else {
          if (this.selectedYear != 0) {
            let tmpUserMoodsByYear = this.filterYear(this.selectedYear);
            userMoods = this.filterMonth(this.filterValue, tmpUserMoodsByYear);
            this.generateChart(userMoods, this.moods);
          }
          else {
            let tmpUserMoodsByYear = this.filterYear(this.year);
            userMoods = this.filterMonth(this.filterValue, tmpUserMoodsByYear);
            this.generateChart(userMoods, this.moods);
          }
        }
      }
    }
  }


  formatData(userMoods: IUsermoods[]) {
    let data = [];
    for (let i = 0; i < userMoods.length; i++) {
      let day = new Date(userMoods[i].created_at).getDate();
      let mood = userMoods[i].mood_name.charAt(0).toUpperCase() + userMoods[i].mood_name.slice(1);
      let num = this.moods.indexOf(mood) + 1;
      let tmp = { x: day, y: num };
      data.push(tmp);
    }
    return data;
  }

  generateDatasets(userMoods: IUsermoods[]) {
    let lineChartDatasets: any[] = []
    if (userMoods.length > 0) {
      let month = new Date(userMoods[0].created_at).getMonth();
      let currentMonth = this.months[month];

      lineChartDatasets = [
        {
          label: currentMonth,
          data: this.formatData(userMoods),
          borderColor: 'rgba(118, 123, 145, 0.6)',
          borderWidth: 3,
          backgroundColor: 'rgba(245, 187, 142, 0.4)',
          pointBackgroundColor: 'rgba(118, 123, 145, 0.8)',
          pointStyle: 'circle',
          pointBorderWidth: 1,
          pointRadius: 6,
          fill: true,
        }
      ];
    }
    return lineChartDatasets;
  }

  generateLabels(userMoods: any) {
    let lineChartLabels = [];
    if (userMoods.length > 0) {
      let tmpYear = new Date(userMoods[0].created_at).getFullYear();
      let tmpMonth = new Date(userMoods[0].created_at).getMonth();
      lineChartLabels = this.daysInMonth(tmpMonth + 1, tmpYear);
    }
    else {
      let month = (new Date()).getMonth() + 1;
      let year = (new Date()).getFullYear();
      let numberOfDays = this.getDays(year, month);
      for (let i = 1; i <= numberOfDays; i++) {
        lineChartLabels.push(i);
      }
    }
    return lineChartLabels;
  }


  generateOptions(moods: any) {
    let moodsToUse = moods;
    let lineChartOptions =
    {
      plugins: {
        tooltip: {
          backgroundColor: 'rgba(108,117,122, 0.8)',
          yAlign: 'bottom',
          displayColors: false,
          callbacks: {
            title: function (chart: any) {
              let yValue = chart[0].formattedValue;
              return moodsToUse[yValue - 1];
            },
            label: function (chart: any) {
              let month = chart.dataset.label;
              let day = chart.label;
              return month + " " + day;
            }
          }
        },
        legend: {
          onClick: function () { },
        },
        datalabels: {
          display: false,
        }
      },
      responsive: true,
      scales: {
        x: {
          ticks: {
            stepSize: 1
          }
        },
        y: {
          min: 1,
          max: moods.length + 1,
          ticks: {
            stepSize: 1,
            callback: function (value: any, index: any, ticks: any) {
              return moods[value - 1];
            }
          }
        }
      }
    };
    return lineChartOptions;
  }

  daysInMonth(month: any, year: any): any {
    let daysNumber = new Date(year, month, 0).getDate();
    let daysArr = [];
    for (let i = 1; i <= daysNumber; i++) {
      daysArr.push(i);
    }
    return daysArr;
  }

  filterMonth(monthvalue: string, userMoodsYear: any[]) {
    this.userMoods = [...this.collection]
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let monthNum = months.findIndex(month => month == monthvalue);
    let tmp = userMoodsYear.filter((oneMood) => {
      let month = new Date(oneMood.created_at).getMonth();
      return month == monthNum;
    });
    if (tmp.length > 0) {
      return tmp;
    }
    else {
      let tmpLastLogged = this.userMoods[(this.userMoods.length) - 1];
      let lastLoggedMonth = (new Date(tmpLastLogged.created_at)).getMonth();
      let tmp = userMoodsYear.filter((oneMood) => {
        let month = new Date(oneMood.created_at).getMonth();
        return month == lastLoggedMonth;
      });
      return tmp;
    }

  }

  filterYear(yearValue: number) {

    let tmpCollectionYear;
    this.userMoods = [...this.collection];

    tmpCollectionYear = this.userMoods.filter((oneMood: { created_at: any; }) => {
      let date = new Date(oneMood.created_at || "");
      let year = date.getFullYear();
      return year == yearValue;
    });
    return tmpCollectionYear;
  }

  generateChart(userMoods: any, moods: any) {
    this.lineChartDatasets = this.generateDatasets(userMoods);
    this.lineChartLabels = this.generateLabels(userMoods);
    this.lineChartOptions = this.generateOptions(moods);
  }


  getDays(year: number, month: number) {
    return new Date(year, month, 0).getDate();
  }
}
