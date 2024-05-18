import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from 'src/environments/environment';
import { AlertService } from '../alert/alert.service';
import { StatisticsDto } from '../dtos/StatisticsDto';

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {
  private baseUrl = environment.baseServerUrl + "/statistics";

  constructor(private httpClient: HttpClient, private spinner: NgxSpinnerService, private alertService: AlertService) { }


  public async getTopTenByCategoryWithinDays(category: string, days: number): Promise<Array<StatisticsDto>> {
    this.spinner.show(); // loader
    let response: Array<StatisticsDto> = [];

    const params = new HttpParams()
    .set('category', category)
    .set('days', days.toString());

    try {
      // Get
      response = await this.httpClient.get<Array<StatisticsDto>>(this.baseUrl + "/getTopTenByCategoryWithinDays", { params: params }).toPromise(); // pass params
    } catch (error) {
      // catch exception
      console.log(error);
      await this.alertService.generateHttpError(error.name);
    }
    this.spinner.hide();
    return response;
  }
}
