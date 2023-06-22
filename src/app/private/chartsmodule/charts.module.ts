import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { LineChartComponent } from './components/line-chart/line-chart.component';
import { PieChartComponent } from './components/pie-chart/pie-chart.component';
import { BarChartComponent } from './components/bar-chart/bar-chart.component';
import { Pie2ChartComponent } from './components/pie2-chart/pie2-chart.component';



@NgModule({
  declarations: [
    LineChartComponent,
    PieChartComponent,
    BarChartComponent,
    Pie2ChartComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [
    LineChartComponent,
    PieChartComponent,
    BarChartComponent,
    Pie2ChartComponent
  ]
})
export class ChartsModule { }
