import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from 'src/environments/environment';
import { AlertService } from '../alert/alert.service';
import { ReviewDto } from '../dtos/ReviewDto';

@Injectable({
  providedIn: 'root'
})
export class FlaggedReviewService {
  private baseUrl = environment.baseServerUrl + "/flaggedReview";

  constructor(private httpClient: HttpClient, private spinner: NgxSpinnerService, private alertService: AlertService) { }

  public async getReviewsFlaggedByUserIdAndProductId(userId: number, productId: number): Promise<Array<ReviewDto>> {
    this.spinner.show(); // loader
    let response: Array<ReviewDto> = [];

    const params = new HttpParams()
      .set('userId', userId.toString())
      .set('productId', productId.toString());

    try {
      // Get
      response = await this.httpClient.get<Array<ReviewDto>>(this.baseUrl + "/getReviewsFlaggedByUserIdAndProductId", { params: params }).toPromise(); // pass params
    } catch (error) {
      // catch exception
      console.log(error);
      await this.alertService.generateHttpError(error.name);
    }
    this.spinner.hide();
    return response;
  }

  public async toggleFlagByUserIdAndReviewId(userId: number, reviewId: number): Promise<boolean> {
    this.spinner.show(); // loader
    let response: Boolean = null;

    const params = new HttpParams()
      .set('userId', userId.toString())
      .set('reviewId', reviewId.toString());

    try {
      // Put
      response = await this.httpClient.put<Boolean>(this.baseUrl + '/toggleFlagByUserIdAndReviewId', null, { params: params }).toPromise(); // pass params
    } catch (error) {
      // catch exception
      console.log(error);
      await this.alertService.generateHttpError(error.name);
    }
    this.spinner.hide();
    return response.valueOf();
  }

}
