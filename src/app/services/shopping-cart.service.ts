import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from 'src/environments/environment';
import { AlertService } from '../alert/alert.service';
import { ShoppingCartDto } from '../dtos/ShoppingCartDto';

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {
  private baseUrl = environment.baseServerUrl + "/shoppingCart";

  constructor(private httpClient: HttpClient, private spinner: NgxSpinnerService, private alertService: AlertService) { }

  public async getAllShoppingCartsByUserId(userId: number): Promise<Array<ShoppingCartDto>> {
    this.spinner.show(); // loader
    const url = this.baseUrl + "/getAllByUserId/" + userId;
    let response: Array<ShoppingCartDto> = [];
    try {
      // Get
      response = await this.httpClient.get<Array<ShoppingCartDto>>(url).toPromise();
    } catch (error) {
      // catch exception
      console.log(error);
      await this.alertService.generateHttpError(error.name);
    }
    this.spinner.hide();
    return response;
  }

  public async addOrUpdateQuantity(shoppingCartToAdd: ShoppingCartDto): Promise<ShoppingCartDto> {
    this.spinner.show(); // loader
    let response: ShoppingCartDto = null;

    try {
      // Put
      response = await this.httpClient.put<ShoppingCartDto>(this.baseUrl + '/addOrUpdateQuantity', shoppingCartToAdd).toPromise(); // pass in request body
    } catch (error) {
      // catch exception
      console.log(error);
      await this.alertService.generateHttpError(error.name);
    }
    this.spinner.hide();
    return response;
  }

  public async updateShoppingCart(shoppingCartToUpdate: ShoppingCartDto): Promise<ShoppingCartDto> {
    this.spinner.show(); // loader
    let response: ShoppingCartDto = null;

    try {
      // Put
      response = await this.httpClient.put<ShoppingCartDto>(this.baseUrl + '/update', shoppingCartToUpdate).toPromise(); // pass in request body
    } catch (error) {
      // catch exception
      console.log(error);
      await this.alertService.generateHttpError(error.name);
    }
    this.spinner.hide();
    return response;
  }

  public async deleteShoppingCart(id: number): Promise<ShoppingCartDto> {
    this.spinner.show(); // loader
    const url = this.baseUrl + "/delete/" + id;
    let response: ShoppingCartDto = null;

    try {
      // Delete
      response = await this.httpClient.delete<ShoppingCartDto>(url).toPromise();
    } catch (error) {
      // catch exception
      console.log(error);
      await this.alertService.generateHttpError(error.name);
    }
    this.spinner.hide();
    return response;
  }

  public async clearShoppingCartByUserId(userId: number): Promise<string> {
    this.spinner.show(); // loader
    const url = this.baseUrl + "/deleteAllByUserId";
    let response: Map<String, String> = null;
    // DELETE request parameters
    const params = new HttpParams().set('userId', userId.toString());

    try {
      // Delete
      response = await this.httpClient.delete<Map<String, String>>(url, { params: params }).toPromise();
    } catch (error) {
      // catch exception
      console.log(error);
      await this.alertService.generateHttpError(error.name);
    }
    this.spinner.hide();
    // return msg - "success"
    return response == null ?  null : (response['msg'] as Object).toString();
  }

  public async checkAllShoppingCartsByUserId(userId: number): Promise<Array<ShoppingCartDto>> {
    this.spinner.show(); // loader
    const url = this.baseUrl + "/checkAllByUserId";
    let response: Array<ShoppingCartDto> = [];
    // PUT request parameters
    const params = new HttpParams().set('userId', userId.toString());

    try {
      // Put
      response = await this.httpClient.put<Array<ShoppingCartDto>>(url, null, { params: params }).toPromise();
    } catch (error) {
      // catch exception
      console.log(error);
      await this.alertService.generateHttpError(error.name);
    }
    this.spinner.hide();
    return response;
  }

  public async unCheckAllShoppingCartsByUserId(userId: number): Promise<Array<ShoppingCartDto>> {
    this.spinner.show(); // loader
    const url = this.baseUrl + "/unCheckAllByUserId";
    let response: Array<ShoppingCartDto> = [];
    // PUT request parameters
    const params = new HttpParams().set('userId', userId.toString());

    try {
      // Put
      response = await this.httpClient.put<Array<ShoppingCartDto>>(url, null, { params: params }).toPromise();
    } catch (error) {
      // catch exception
      console.log(error);
      await this.alertService.generateHttpError(error.name);
    }
    this.spinner.hide();
    return response;
  }
}
