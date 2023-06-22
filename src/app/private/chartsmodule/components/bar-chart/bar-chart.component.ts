import { Component, Input, OnInit, SimpleChange, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartData, ChartEvent, ChartOptions, ChartType } from 'chart.js';
import DataLabelsPlugin from 'chartjs-plugin-datalabels';
import { BaseChartDirective, ThemeService } from 'ng2-charts';
import { ActivityService } from 'src/app/private/services/activity.service';


@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css']
})
export class BarChartComponent implements OnInit {

  currentYear = new Date().getFullYear();
  currentMonth = new Date().getMonth() + 1;
  monthDays: string[] = [];
  barChartData?: ChartData<'bar'>;
  @Input() collection: any[] = [];
  @Input() filterValue: string = '';
  readonly months: string[] = ["January", "February", "March", "April", "May", "Jun", "July", "August", "September", "October", "November", "December"];


  userSteps: any;

  user_id: number = 0;
  selectedYear: number = 0;
  year = new Date().getFullYear();
  month = new Date().toLocaleString('en-US', { month: 'long' });
  public barChartOptions: ChartConfiguration['options'];


  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;


  public barChartType: ChartType = 'bar';
  public barChartPlugins = [
    DataLabelsPlugin
  ];


  constructor(private activityService: ActivityService) { }

  ngOnInit(): void {

  }

  ngOnChanges(changes: SimpleChange) {
    this.user_id = Number(localStorage.getItem('user_id'));
    let tmpUserSteps;
    let userSteps;
    if (this.collection.length != 0) {
      this.userSteps = [...this.collection];
      if (this.filterValue == "") {
        let tmpLastLoggedMonth = new Date(this.collection[0].created_at).toLocaleString('default', { month: 'long' });
        let tmpLastLoggedMonthNum = new Date(this.collection[0].created_at).getMonth();
        let tmpLastLoggedYear = new Date(this.collection[0].created_at).getFullYear();
        if (tmpLastLoggedYear === this.year) {
          tmpUserSteps = this.filterYear(this.year); //radi dobro
        }
        else {
          tmpUserSteps = this.filterYear(tmpLastLoggedYear);
        }
        this.monthDays = this.daysInMonth(tmpLastLoggedYear, tmpLastLoggedMonthNum);
        userSteps = this.filterMonth(tmpLastLoggedMonth, tmpUserSteps);
        let data = this.formatData(userSteps);
        this.barChartData = this.generateChartData(data, this.monthDays, tmpLastLoggedMonth, tmpLastLoggedYear);
        this.barChartOptions = this.generateChartDataOptions();

      }
      else if (this.filterValue !== "") {
        if (Number(this.filterValue)) {
          this.selectedYear = Number(this.filterValue);
          let tmpUserSteps = this.filterYear(this.selectedYear);
          let tmpMonth = new Date(tmpUserSteps[0].created_at).toLocaleString('en-US', { month: 'long' });
          let tmpMonthNum = new Date(tmpUserSteps[0].created_at).getMonth();
          this.monthDays = this.daysInMonth(this.selectedYear, tmpMonthNum);
          userSteps = this.filterMonth(tmpMonth, tmpUserSteps);
          let data = this.formatData(userSteps, this.selectedYear);
          this.barChartData = this.generateChartData(data, this.monthDays, tmpMonth, this.selectedYear);
          this.barChartOptions = this.generateChartDataOptions();
        }
        else if (this.filterValue == 'oldest') {
          let tmpUserMoodsDESC = ([...this.collection]).reverse();
          this.selectedYear = new Date(tmpUserMoodsDESC[0].created_at).getFullYear();
          let tmpUserStepsYear = this.filterYear(this.selectedYear);
          let tmpMonth = new Date(tmpUserStepsYear[0].created_at).toLocaleString('en-US', { month: 'long' });
          userSteps = this.filterMonth(tmpMonth, tmpUserStepsYear);
          let data = this.formatData(userSteps, this.selectedYear);
          this.barChartData = this.generateChartData(data, this.monthDays, tmpMonth, this.selectedYear);
          this.barChartOptions = this.generateChartDataOptions();
        }
        else if (this.filterValue == 'latest') {
          this.selectedYear = 0;
          let lastLoggedYear = new Date(this.collection[0].created_at).getFullYear();
          let tmpUserStepsYear = this.filterYear(lastLoggedYear);
          let tmpMonth = new Date(tmpUserStepsYear[0].created_at).toLocaleString('en-US', { month: 'long' });
          let tmpMonthNum = new Date(tmpUserStepsYear[0].created_at).getMonth();
          userSteps = this.filterMonth(tmpMonth, tmpUserStepsYear);
          let data = this.formatData(userSteps, lastLoggedYear);
          this.monthDays = this.daysInMonth(this.selectedYear, tmpMonthNum);
          this.barChartData = this.generateChartData(data, this.monthDays, tmpMonth, lastLoggedYear);
          this.barChartOptions = this.generateChartDataOptions();
        }
        else {
          if (this.selectedYear != 0) {
            let tmpUserStepsByYear = this.filterYear(this.selectedYear);
            userSteps = this.filterMonth(this.filterValue, tmpUserStepsByYear);
            let data = this.formatData(userSteps, this.selectedYear);
            let tmpMonthNum = this.months.indexOf(this.filterValue) + 1;
            this.monthDays = this.daysInMonth(tmpMonthNum, this.selectedYear);
            this.barChartData = this.generateChartData(data, this.monthDays, this.filterValue, this.selectedYear);
            this.barChartOptions = this.generateChartDataOptions();
          }
          else {
            let tmpUserStepsByYear = this.filterYear(this.year);
            let tmpMonthNum = this.months.indexOf(this.filterValue) + 1;
            this.monthDays = this.daysInMonth(tmpMonthNum, this.year);
            userSteps = this.filterMonth(this.filterValue, tmpUserStepsByYear);
            let data = this.formatData(userSteps, this.selectedYear);
            this.barChartData = this.generateChartData(data, this.monthDays, this.filterValue, this.currentYear);
            this.barChartOptions = this.generateChartDataOptions();
          }
        }
      }
    }
  }



  daysInMonth(month: any, year: any) {
    let monthArray: string[] = [];
    let d = new Date(year, month, 0).getDate();
    for (let i = 1; i <= d; i++) {
      monthArray.push(String(i));
    }
    return monthArray;
  }

  generateChartData(data: number[], labels: string[], month?: any, year?: any) {
    let tmp =
    {
      labels: labels,
      datasets: [
        {
          label: month + " " + year, //POTREBNO JE DA SE UPISE MESEC I GODINA
          data: data,
          backgroundColor: [
            'rgba(245, 187, 142, 0.7)',
            'rgba(42, 50, 75, 0.7)', //boja za svaki slajs po redu
            'rgba(118, 123, 145, 0.7)',
            'rgba(199, 204, 219, 0.7)',
            'rgba(247, 199, 161, 0.7)',
            'rgba(249, 209, 178, 0.7)'
          ],
          borderColor: [
            // 'rgba(154, 141, 57, 0.5)', //previse je tamna
            'rgba(118, 123, 145, 0.4)'
          ],
          borderWidth: 1
        },
      ]
    };
    return tmp;
  }


  formatData(collection: any[], year?: any, month?: any) {
    let useYear: number;
    if (year) {
      useYear = year;
    }
    else {
      useYear = this.currentYear;
    }
    let useMonth: number;

    let tmpFiltrByYear = collection.filter((element) => {
      let tmpYear = new Date(element.created_at).getFullYear();

      if (tmpYear === useYear) {
        return element;
      }
    });

    if (month) {
      useMonth = month;
    }
    else {
      let lastMonth = new Date(tmpFiltrByYear[0].created_at).getMonth();
      useMonth = lastMonth;
    }

    let tmpFilterMonth = tmpFiltrByYear.filter((element) => {
      let tmpMonth = new Date(element.created_at).getMonth();
      if (tmpMonth === useMonth) {
        return element;
      }
      else return element;
    });

    //kolekcija datog meseca treba izvuci svaki podatak i spakovati u niz
    let array = [];
    for (let i = 0; i < this.monthDays.length; i++) {
      array.push(0);
    }

    tmpFilterMonth.forEach((element) => {
      let tmp = new Date(element.created_at).getDate();
      array[tmp - 1] = element.step_count;
    });

    return array;
  }


  filterYear(yearValue: number) {
    let tmpCollectionYear;
    this.collection = [...this.userSteps];
    tmpCollectionYear = this.collection.filter((oneStepLog: { created_at: any; }) => {
      let date = new Date(oneStepLog.created_at || "");
      let year = date.getFullYear();
      return year == yearValue;
    });
    return tmpCollectionYear;
  }

  filterMonth(monthvalue: string, userStepsYear: any[]) {
    this.collection = [...this.userSteps];
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let monthNum = months.findIndex(month => month == monthvalue);
    let tmp = userStepsYear.filter((oneStepLog) => {
      let month = new Date(oneStepLog.created_at).getMonth();
      return month == monthNum;
    });
    if (tmp.length > 0) {
      return tmp;
    }
    else {
      let tmpLastLogged = this.collection[(this.collection.length) - 1];
      let lastLoggedMonth = (new Date(tmpLastLogged.created_at)).getMonth();
      let tmp = userStepsYear.filter((oneStepLog) => {
        let month = new Date(oneStepLog.created_at).getMonth();
        return month == lastLoggedMonth;
      });
      return tmp;
    }
  }

  generateChartDataOptions(): ChartConfiguration['options'] {
    let tmp: ChartConfiguration['options'] = {
      responsive: true,
      // We use these empty structures as placeholders for dynamic theming.
      scales: {
        x: {},
        y: {
          min: 0,
          max: 30000,
          ticks: {
            callback: function (value: any, index: any, ticks: any) {
              return value + ' steps';
            },
            // forces step size to be 50 units
            stepSize: 5000
          }
        }
      },
      plugins: {
        legend: {
          display: true,
        },
        datalabels: {
          display: false,
          anchor: 'end',
          align: 'end'
        }
      }
    };
    return tmp;
  }
}
