import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService } from './alert/alert.service';
import { AccessControlList } from './auth/access-control-list';
import { OrderDto } from './dtos/OrderDto';
import { ROLE_ADMIN, ROLE_USER } from './dtos/UserDto';
import { AuthenticationService } from './services/authentication.service';
import { OrderService } from './services/order.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'projectfrontend';

  public isClose = false; // sidebar toggle
  // pass in child component
  public orders: Array<OrderDto> = [];
  public notificationCount = 0;

  constructor(public router: Router, public accessCtrlList: AccessControlList, private authService: AuthenticationService, private orderService: OrderService, private alertService: AlertService) {
  }

  async ngOnInit(): Promise<void> {
    // check if user exists in session
    if (sessionStorage.getItem('userId')) {
      // retrieve user from db
      await this.authService.getUserById(parseInt(sessionStorage.getItem('userId'), 10));
    }
    await this.retrieveOrdersAndStatusUpdate();
  }

  public async loginTesting(role: string): Promise<void> {
    // instant login to make the testing easier
    // logout first if already logged in
    if (this.authService.currentUser != null)
      await this.authService.logout(true);
    // user
    if (role == ROLE_USER)
      await this.authService.login('testing@user', 'useruser1');
    // admin
    if (role == ROLE_ADMIN)
      await this.authService.login('testing@admin', 'adminadmin1');
  }

  public async retrieveOrdersAndStatusUpdate(): Promise<void> {
    // check if logged in
    if (this.authService.currentUser != null) {
      this.notificationCount = 0;
      // get all orders and update count for logged in user
      if (this.authService.currentUser?.userRole == ROLE_USER) {
        this.orders = await this.orderService.getAllOrdersByUserId(this.authService.currentUser?.userId);
        this.orders.forEach(order => {
          if (order.status != order.statusCheckedByUserLastTime)
            this.notificationCount++;
        });
      }
      // get all orders and update count for admin
      if (this.authService.currentUser?.userRole == ROLE_ADMIN) {
        this.orders = await this.orderService.getAllOrdersForAdmin();
        this.orders.forEach(order => {
          if (order.status != order.statusCheckedByAdminLastTime)
            this.notificationCount++;
        });
      }
    }
  }

  public toggleClick(): void {
    this.isClose = !this.isClose;
  }

  public async navTo(link: string): Promise<void> {
    if (this.accessCtrlList.canAccess(link))
      this.router.navigate(['/' + link]);
    else if (link == 'statistics')
      await this.alertService.confirmPrompt("Please login as ADMIN.", 'OK', false);
    else
      await this.alertService.confirmPrompt("Please login as USER.", 'OK', false);
  }
}
