import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from 'src/environments/environment';
import { AlertService } from '../alert/alert.service';
import { FavoriteDto } from '../dtos/FavoriteDto';


@Injectable({
  providedIn: 'root'
})
export class FavoriteService {

  private baseUrl = environment.baseServerUrl + "/favorite";

  constructor(private httpClient: HttpClient, private spinner: NgxSpinnerService, private alertService: AlertService) { }

  public async getAllFavoritesByUserId(userId: number): Promise<Array<FavoriteDto>> {
    this.spinner.show(); // loader
    const url = this.baseUrl + "/getAllByUserId/" + userId;
    let response: Array<FavoriteDto> = [];
    try {
      // Get
      response = await this.httpClient.get<Array<FavoriteDto>>(url).toPromise();
    } catch (error) {
      // catch exception
      console.log(error);
      await this.alertService.generateHttpError(error.name);
    }
    this.spinner.hide();
    return response;
  }

  public async addFavorite(favoriteToAdd: FavoriteDto): Promise<FavoriteDto> {
    this.spinner.show(); // loader
    let response: FavoriteDto = null;

    try {
      // Post
      response = await this.httpClient.post<FavoriteDto>(this.baseUrl + '/add', favoriteToAdd).toPromise(); // pass in request body
    } catch (error) {
      // catch exception
      console.log(error);
      await this.alertService.generateHttpError(error.name);
    }
    this.spinner.hide();
    return response;
  }

  public async deleteFavorite(id: number): Promise<FavoriteDto> {
    this.spinner.show(); // loader
    let response: FavoriteDto = null;
    const url = this.baseUrl + "/delete/" + id;
    try {
      // Delete
      response = await this.httpClient.delete<FavoriteDto>(url).toPromise();
    } catch (error) {
      // catch exception
      console.log(error);
      await this.alertService.generateHttpError(error.name);
    }
    this.spinner.hide();
    return response;
  }

}
