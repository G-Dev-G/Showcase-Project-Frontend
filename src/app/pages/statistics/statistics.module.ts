import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StatisticsPage } from './statistics.page';
import { StatisticsPageRoutingModule } from './statistics-routing.module';
import { NgxChartsModule } from '@swimlane/ngx-charts';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    StatisticsPageRoutingModule,
    NgxChartsModule // Ngx Charts
  ],
  declarations: [StatisticsPage]
})
export class StatisticsPageModule {}
