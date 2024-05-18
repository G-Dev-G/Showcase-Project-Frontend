
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from 'src/environments/environment';
import { AlertService } from '../alert/alert.service';
import { ProductDto } from '../dtos/ProductDto';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private baseUrl = environment.baseServerUrl + "/product";

  constructor(private httpClient: HttpClient, private spinner: NgxSpinnerService, private alertService: AlertService) { }

  public async getAllProducts(): Promise<Array<ProductDto>> {
    this.spinner.show(); // loader
    const url = this.baseUrl + "/getAll";
    let response: Array<ProductDto> = [];
    try {
      // Get
      response = await this.httpClient.get<Array<ProductDto>>(url).toPromise();
    } catch (error) {
      // catch exception
      console.log(error);
      await this.alertService.generateHttpError(error.name);
    }
    this.spinner.hide();
    return response;
  }

  public async getAllProductsByCriteria(category: string, priceSortBy: string): Promise<Array<ProductDto>> {
    this.spinner.show(); // loader

    // attach get request parameters
    const url = this.baseUrl + "/getAllByCriteria?category=" + category + "&priceSortBy=" + priceSortBy;
    let response: Array<ProductDto> = [];

    try {
      // Get
      response = await this.httpClient.get<Array<ProductDto>>(url).toPromise();
    } catch (error) {
      // catch exception
      console.log(error);
      await this.alertService.generateHttpError(error.name);
    }
    this.spinner.hide();
    return response;
  }

  public async getProductById(id: number): Promise<ProductDto> {
    this.spinner.show(); // loader
    const url = this.baseUrl + "/getById/" + id;
    let response: ProductDto = null;
    try {
      // Get
      response = await this.httpClient.get<ProductDto>(url).toPromise();
    } catch (error) {
      // catch exception
      console.log(error);
      await this.alertService.generateHttpError(error.name);
    }
    this.spinner.hide();
    return response;
  }

  public async addProduct(productToAdd: ProductDto): Promise<ProductDto> {
    this.spinner.show(); // loader
    let response: ProductDto = null;

    try {
      // Post
      response = await this.httpClient.post<ProductDto>(this.baseUrl + '/add', productToAdd).toPromise(); // pass in request body
    } catch (error) {
      // catch exception
      console.log(error);
      await this.alertService.generateHttpError(error.name);
    }
    this.spinner.hide();
    return response;
  }

  public async updateProduct(productToUpdate: ProductDto): Promise<ProductDto> {
    this.spinner.show(); // loader
    let response: ProductDto = null;

    try {
      // Put
      response = await this.httpClient.put<ProductDto>(this.baseUrl + '/update', productToUpdate).toPromise(); // pass in request body
    } catch (error) {
      // catch exception
      console.log(error);
      await this.alertService.generateHttpError(error.name);
    }
    this.spinner.hide();
    return response;
  }

  public async deleteProduct(id: number): Promise<ProductDto> {
    this.spinner.show(); // loader
    let response: ProductDto = null;
    const url = this.baseUrl + "/delete/" + id;

    try {
      // Delete
      response = await this.httpClient.delete<ProductDto>(url).toPromise();
    } catch (error) {
      // catch exception
      console.log(error);
      await this.alertService.generateHttpError(error.name);
    }
    this.spinner.hide();
    return response;
  }
}
