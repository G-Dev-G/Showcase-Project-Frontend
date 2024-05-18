import { Injectable } from '@angular/core';
import { ROLE_ADMIN, ROLE_USER } from '../dtos/UserDto';
import { AuthenticationService } from '../services/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AccessControlList {

  // access control list
  // * => OPEN TO ALL
  private ACL = {
    'products': ['*'],
    ':productId': ['*'],
    'about': ['*'],
    'login': ['PUBLIC'],
    'register': ['PUBLIC'],
    'shopping-cart': [ROLE_USER],
    'favorite': [ROLE_USER],
    'account': [ROLE_USER, ROLE_ADMIN],
    'order-success': [ROLE_USER],
    'statistics': [ROLE_ADMIN]
  };

  constructor(private authService: AuthenticationService) { }

  public canAccess(requestRoute: string): boolean {
    const roles: Array<string> = this.ACL[requestRoute]; // get the defined symbol for route
    // invalid route
    if (!roles)
      return false;
    // order success page access
    if (requestRoute == 'order-success') {
      if (sessionStorage.getItem('orderId') != null)
        return roles.includes(this.authService.currentUser?.userRole);
      // unable to access without orderId
      return false;
    }
    // open to all
    if (roles.indexOf('*') >= 0)
      return true;
    // open only to public
    if (roles.indexOf('PUBLIC') >= 0)
      return !this.authService.currentUser?.userRole;
    // valid for current user role USER/ADMIN
    return roles.includes(this.authService.currentUser?.userRole);
  }
}
