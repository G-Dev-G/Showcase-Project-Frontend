import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from 'src/environments/environment';
import { AlertService } from '../alert/alert.service';
import { OrderDto } from '../dtos/OrderDto';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private baseUrl = environment.baseServerUrl + "/order";

  constructor(private httpClient: HttpClient, private spinner: NgxSpinnerService, private alertService: AlertService) { }

  public async getOrderById(orderId: number): Promise<OrderDto> {
    this.spinner.show(); // loader
    const url = this.baseUrl + "/getById/" + orderId;
    let response: OrderDto = null;
    try {
      // Get
      response = await this.httpClient.get<OrderDto>(url).toPromise();
    } catch (error) {
      // catch exception
      console.log(error);
      await this.alertService.generateHttpError(error.name);
    }
    this.spinner.hide();
    return response;
  }

  public async getAllOrdersByUserId(userId: number): Promise<Array<OrderDto>> {
    this.spinner.show(); // loader
    const url = this.baseUrl + "/getAllByUserId/" + userId;
    let response: Array<OrderDto> = [];
    try {
      // Get
      response = await this.httpClient.get<Array<OrderDto>>(url).toPromise();
    } catch (error) {
      // catch exception
      console.log(error);
      await this.alertService.generateHttpError(error.name);
    }
    this.spinner.hide();
    return response;
  }

  public async getAllOrdersForAdmin(): Promise<Array<OrderDto>> {
    this.spinner.show(); // loader
    const url = this.baseUrl + "/getAll";
    let response: Array<OrderDto> = [];
    try {
      // Get
      response = await this.httpClient.get<Array<OrderDto>>(url).toPromise();
    } catch (error) {
      // catch exception
      console.log(error);
      await this.alertService.generateHttpError(error.name);
    }
    this.spinner.hide();
    return response;
  }

  public async addOrder(orderToAdd: OrderDto): Promise<OrderDto> {
    this.spinner.show(); // loader
    let response: OrderDto = null;

    try {
      // Post
      response = await this.httpClient.post<OrderDto>(this.baseUrl + '/add', orderToAdd).toPromise(); // pass in request body
    } catch (error) {
      // catch exception
      console.log(error);
      await this.alertService.generateHttpError(error.name);
    }
    this.spinner.hide();
    sessionStorage.setItem('orderId', response.orderId.toString()); // store orderId into session

    return response;
  }

  public async updateOrderStatusUser(orderId: number, status: string): Promise<OrderDto> {
    this.spinner.show(); // loader
    let response: OrderDto = null;
    // PUT request parameters
    const params = new HttpParams()
      .set('orderId', orderId.toString())
      .set('status', status);

    try {
      // Put
      response = await this.httpClient.put<OrderDto>(this.baseUrl + '/updateOrderStatusUser', null, { params: params }).toPromise(); // pass params
    } catch (error) {
      // catch exception
      console.log(error);
      await this.alertService.generateHttpError(error.name);
    }
    this.spinner.hide();
    return response;
  }

  public async updateOrderStatusAdmin(orderId: number, status: string): Promise<OrderDto> {
    this.spinner.show(); // loader
    let response: OrderDto = null;
    // PUT request parameters
    const params = new HttpParams()
      .set('orderId', orderId.toString())
      .set('status', status);

    try {
      // Put
      response = await this.httpClient.put<OrderDto>(this.baseUrl + '/updateOrderStatusAdmin', null, { params: params }).toPromise(); // pass params
    } catch (error) {
      // catch exception
      console.log(error);
      await this.alertService.generateHttpError(error.name);
    }
    this.spinner.hide();
    return response;
  }
}
