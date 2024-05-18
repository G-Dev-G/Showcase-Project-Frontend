import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { BarVerticalComponent } from '@swimlane/ngx-charts';
import { StatisticsDto } from 'src/app/dtos/StatisticsDto';
import { ROLE_ADMIN } from 'src/app/dtos/UserDto';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { StatisticsService } from 'src/app/services/statistics.service';

@Component({
  selector: 'app-statistics',
  templateUrl: 'statistics.page.html',
  styleUrls: ['statistics.page.scss'],
})
export class StatisticsPage implements OnInit {
  @ViewChild("chart") chart: BarVerticalComponent;
  @ViewChild('categorySelect') categorySelect: ElementRef;
  @ViewChild('dateRangeSelect') dateRangeSelect: ElementRef;

  public statisticsList: Array<StatisticsDto> = [];
  public chartData = [];

  constructor(private statisticsService: StatisticsService, private authService: AuthenticationService) { }

  async ngOnInit(): Promise<void> {
    if (this.authService.currentUser?.userRole == ROLE_ADMIN) {
      this.statisticsList = await this.statisticsService.getTopTenByCategoryWithinDays('', 30); // default params

      this.statisticsList.forEach(statistics => {
        // populate chart data
        this.chartData.push({
          "name": statistics.shortName,
          "value": statistics.sum,
        })
      });

      // refresh chart data
      this.chart.results = this.chartData;
      this.chart.update();
    }
  }

  public async filterOnChange(): Promise<void> {
    // get dropdown value
    const selectedCategory = this.categorySelect.nativeElement.value;
    const selectedDateRange = this.dateRangeSelect.nativeElement.value;

    // validation
    if (this.authService.currentUser?.userRole == ROLE_ADMIN) {
      this.statisticsList = await this.statisticsService.getTopTenByCategoryWithinDays(selectedCategory, selectedDateRange);

      this.chartData = [];
      this.statisticsList.forEach(statistics => {
        // populate chart data
        this.chartData.push({
          "name": statistics.shortName,
          "value": statistics.sum,
        })
      });

      // refresh chart data
      this.chart.results = this.chartData;
      this.chart.update();
    }
  }
}
