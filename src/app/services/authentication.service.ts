import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AlertService } from '../alert/alert.service';
import { UserDto } from '../dtos/UserDto';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  // default logged in user to NULL
  public currentUserSubject = new BehaviorSubject<UserDto>(null);
  public currentUser: UserDto = null;

  private baseUrl = environment.baseServerUrl + "/auth";

  constructor(private httpClient: HttpClient, private spinner: NgxSpinnerService, private alertService: AlertService) {
    // subscribe the change
    this.currentUserSubject.subscribe(user => {
      this.currentUser = user;
    })
  }

  public async getUserById(id: number): Promise<UserDto> {
    this.spinner.show(); // loader
    const url = this.baseUrl + "/getUserById/" + id;
    let userDto: UserDto = null;
    try {
      // Get
      userDto = await this.httpClient.get<UserDto>(url).toPromise();
    } catch (error) {
      // catch exception
      console.log(error);
      await this.alertService.generateHttpError(error.name);
      return null;
    }
    this.spinner.hide();
    this.currentUserSubject.next(userDto); // store to local userDto
    return userDto;
  }

  /**
   * Login request
   * @param usernameEmail
   * @param password
   * @returns
   */
  public async login(usernameEmail: string, password: string): Promise<string> {
    this.spinner.show(); // loader
    // pass header info
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Basic ' + btoa(usernameEmail + ':' + password));
    let response: Map<String, Object> = null;
    try {
      // Get
      response = await this.httpClient.get<Map<String, Object>>(this.baseUrl + '/login', { headers }).toPromise();
    } catch (error) {
      this.spinner.hide();
      // login request is not authenticated
      return "failed";
    }
    this.spinner.hide();
    // success
    sessionStorage.setItem('token', response['token']); // store token into session
    sessionStorage.setItem('userId', (response['userDto'] as UserDto).userId.toString()); // store user id into session
    this.currentUserSubject.next(response['userDto']); // store userDto
    location.href = "/products"; // refresh
    return "success";
  }

  /**
   * Register request
   * @returns
   */
  public async register(name: string, usernameEmail: string, password: string, userRole: string, verificationCode: string, adminRegisterCode: string): Promise<string> {
    this.spinner.show(); // loader
    let response: Map<String, Object> = null;
    // POST request parameters
    const params = new HttpParams()
      .set('name', name)
      .set('usernameEmail', usernameEmail)
      .set('password', password)
      .set('userRole', userRole)
      .set('verificationCode', verificationCode)
      .set('adminRegisterCode', adminRegisterCode);
    try {
      // Post
      response = await this.httpClient.post<Map<String, Object>>(this.baseUrl + '/register', null, { params: params }).toPromise();
    } catch (error) {
      this.spinner.hide();
      // catch exception
      console.log(error);
      return;
    }
    this.spinner.hide();
    // return backend msg ("user exists" / "code incorrect" / "code expired" / "admin code incorrect" / "fail" / "success")
    return response == null ?  null : (response['msg'] as Object).toString();
  }

  /**
   * logout request
   */
  public async logout(noRefresh?: boolean): Promise<void> {
    console.log(sessionStorage.getItem('token'));
    this.spinner.show(); // loader
    let response: Map<String, String> = null;
    try {
      // Get
      response = await this.httpClient.get<Map<String, String>>(this.baseUrl + '/logout').toPromise();
    } catch (error) {
      // catch exception
      console.log(error);
      await this.alertService.generateHttpError(error.name);
      return;
    }
    this.spinner.hide();
    // backend logged out
    if (response['msg'] == "success") {
      sessionStorage.removeItem('token'); // remove token
      sessionStorage.removeItem('userId'); // remove user id
      this.currentUserSubject.next(null); // remove userDto
      if (!noRefresh)
        location.href = "/products"; // refresh
    }
    else
      await this.alertService.generateHttpError(response['msg']);
  }

  public isLoggedIn(): boolean {
    let token = sessionStorage.getItem('token');
    if (token != null && token != undefined)
      return true;
    return false;
  }

  public async updateNameAndAddress(userId: number, name: string, address: string): Promise<UserDto> {
    this.spinner.show(); // loader
    let response: UserDto = null;
    // PUT request parameters
    const params = new HttpParams()
      .set('userId', userId.toString())
      .set('name', name)
      .set('address', address);

    try {
      // Put
      response = await this.httpClient.put<UserDto>(this.baseUrl + '/updateNameAndAddress', null, { params: params }).toPromise(); // pass params
    } catch (error) {
      // catch exception
      console.log(error);
      await this.alertService.generateHttpError(error.name);
    }
    this.spinner.hide();
    return response;
  }

  public async updatePassword(userId: number, currentPassword: string, newPassword: string): Promise<Map<String, Object>> {
    this.spinner.show(); // loader
    let response: Map<String, Object> = null;
    // PUT request parameters
    const params = new HttpParams()
      .set('userId', userId.toString())
      .set('currentPassword', currentPassword)
      .set('newPassword', newPassword);

    try {
      // Put
      response = await this.httpClient.put<Map<String, Object>>(this.baseUrl + '/updatePassword', null, { params: params }).toPromise(); // pass params
    } catch (error) {
      // catch exception
      console.log(error);
      await this.alertService.generateHttpError(error.name);
    }
    this.spinner.hide();
    return response; // contain 'passwordCorrect' and possibly 'userDto'
  }

  public async sendEmailCodeToRegister(email: string): Promise<string> {
    this.spinner.show(); // loader
    let response: Map<String, String> = null;
    // PUT request parameters
    const params = new HttpParams()
      .set('email', email);

    try {
      // Put
      response = await this.httpClient.put<Map<String, String>>(this.baseUrl + "/sendEmailCodeToRegister", null, { params: params }).toPromise();
    } catch (error) {
      // catch exception
      console.log(error);
      await this.alertService.generateHttpError(error.name);
    }
    this.spinner.hide();
    // return msg - "success"
    return response == null ?  null : (response['msg'] as Object).toString();
  }

  public async sendEmailCodeToResetPassword(email: string): Promise<string> {
    this.spinner.show(); // loader
    let response: Map<String, String> = null;
    // PUT request parameters
    const params = new HttpParams()
      .set('email', email);

    try {
      // Put
      response = await this.httpClient.put<Map<String, String>>(this.baseUrl + "/sendEmailCodeToResetPassword", null, { params: params }).toPromise();
    } catch (error) {
      // catch exception
      console.log(error);
      await this.alertService.generateHttpError(error.name);
    }
    this.spinner.hide();
    // return msg - "user not existed" / "success"
    return response == null ?  null : (response['msg'] as Object).toString();
  }

  public async resetPasswordByEmailCode(email: string, verificationCode: string, newPassword: string): Promise<string> {
    this.spinner.show(); // loader
    let response: Map<String, String> = null;
    // PUT request parameters
    const params = new HttpParams()
      .set('email', email)
      .set('verificationCode', verificationCode)
      .set('newPassword', newPassword);

    try {
      // Put
      response = await this.httpClient.put<Map<String, String>>(this.baseUrl + "/resetPasswordByEmailCode", null, { params: params }).toPromise();
    } catch (error) {
      // catch exception
      console.log(error);
      await this.alertService.generateHttpError(error.name);
    }
    this.spinner.hide();
    // return msg - "user not existed" / "code incorrect" / "code expired" / "success"
    return response == null ?  null : (response['msg'] as Object).toString();
  }

}
