import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AccessControlList } from './access-control-list';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private accessControlList: AccessControlList,
    private router: Router
  ) { }

  // implement Auth Guard
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    console.log(route.routeConfig.path);
    if (this.accessControlList.canAccess(route.routeConfig.path))
      return true;
    this.router.navigate(['/products']);
    return false;
  }
}
