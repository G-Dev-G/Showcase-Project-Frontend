import { HttpErrorResponse, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AlertService } from '../alert/alert.service';
import { AuthenticationService } from '../services/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AuthHttpInterceptor implements HttpInterceptor {

  constructor(private alertService: AlertService, private authService: AuthenticationService) { }

  /**
   * Http Interceptor
   * Detect if user is logged in (has token). if true, append header.
   * @param req
   * @param next
   * @returns req
   */
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<any> {
    if (sessionStorage.getItem('token')) {
      // after login
      req = req.clone({
        headers: req.headers.set('token', sessionStorage.getItem('token'))
      });
      // JDBC session validation for every authenticated request
      return next.handle(req).pipe(
        catchError(async (response: HttpErrorResponse) => {
          console.log(response);

          // Unauthorized error
          if (response.status == 401) {
            // session expired, clear storage and redirect
            sessionStorage.removeItem('token'); // remove token
            sessionStorage.removeItem('userId'); // remove user id
            this.authService.currentUserSubject.next(null); // remove userDto
            await this.alertService.generateHttpError("Session timeout, please login again.");
            location.href = "/products"; // refresh
          }
          return throwError(response);
        })
      )
    }

    // login request - header appended in the login method
    return next.handle(req);

  }
}
