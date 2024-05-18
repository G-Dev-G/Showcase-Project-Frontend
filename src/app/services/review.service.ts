import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from 'src/environments/environment';
import { AlertService } from '../alert/alert.service';
import { ReviewDto } from '../dtos/ReviewDto';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private baseUrl = environment.baseServerUrl + "/review";

  constructor(private httpClient: HttpClient, private spinner: NgxSpinnerService, private alertService: AlertService) { }

  public async getAllReviewsByProductId(productId: number): Promise<Array<ReviewDto>> {
    this.spinner.show(); // loader
    const url = this.baseUrl + "/getAllByProductId/" + productId;
    let response: Array<ReviewDto> = [];
    try {
      // Get
      response = await this.httpClient.get<Array<ReviewDto>>(url).toPromise();
    } catch (error) {
      // catch exception
      console.log(error);
      await this.alertService.generateHttpError(error.name);
    }
    this.spinner.hide();
    return response;
  }


  public async setReview(reviewToSet: ReviewDto): Promise<ReviewDto> {
    this.spinner.show(); // loader
    let response: ReviewDto = null;

    try {
      // Put
      response = await this.httpClient.put<ReviewDto>(this.baseUrl + '/set', reviewToSet).toPromise(); // pass in request body
    } catch (error) {
      // catch exception
      console.log(error);
      await this.alertService.generateHttpError(error.name);
    }
    this.spinner.hide();
    return response;
  }
}
