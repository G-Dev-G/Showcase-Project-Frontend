import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CANCELLED_STATUS, COMPLETED_STATUS, CONFIRMED_STATUS, OrderDto, PENDING_STATUS, RETURNED_STATUS } from 'src/app/dtos/OrderDto';
import { ROLE_ADMIN, ROLE_USER } from 'src/app/dtos/UserDto';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-order-status-modal',
  templateUrl: './order-status-modal.component.html',
  styleUrls: ['./order-status-modal.component.scss']
})
export class OrderStatusModalComponent implements OnInit {
  @Input() orders: Array<OrderDto> = [];
  @Output() updateStatusEvent = new EventEmitter<string>();

  // badge number for ADMIN
  public pendingCount = 0;
  public completedCount = 0;
  public returnedCount = 0;
  // badge number for USER
  public confirmedCount = 0;
  public cancelledCount = 0;

  constructor(public activeModal: NgbActiveModal, public authService: AuthenticationService, private orderService: OrderService) { }

  ngOnInit(): void {
    this.updateBadgeCount(); // UI update
  }

  private updateBadgeCount(): void {
    this.pendingCount = 0;
    this.completedCount = 0;
    this.returnedCount = 0;
    this.confirmedCount = 0;
    this.cancelledCount = 0;
    this.orders.forEach(order => {
      // user
      if (this.authService.currentUser?.userRole == ROLE_USER) {
        if (order.status != order.statusCheckedByUserLastTime) {
          if (order.status == CONFIRMED_STATUS)
            this.confirmedCount++;
          if (order.status == CANCELLED_STATUS)
            this.cancelledCount++;
        }
      }
      // admin
      if (this.authService.currentUser?.userRole == ROLE_ADMIN) {
        if (order.status != order.statusCheckedByAdminLastTime) {
          if (order.status == PENDING_STATUS)
            this.pendingCount++;
          if (order.status == COMPLETED_STATUS)
            this.completedCount++;
          if (order.status == RETURNED_STATUS)
            this.returnedCount++;
        }
      }
    });
  }

  // USER update operation
  public async updateOrderStatusAsUser(orderId: number, status: string): Promise<void> {
    // validation
    if (this.authService.currentUser?.userRole == ROLE_USER) {
      await this.orderService.updateOrderStatusUser(orderId, status); // update status
      // update orders and UI
      this.orders = await this.orderService.getAllOrdersByUserId(this.authService.currentUser?.userId);
      this.updateBadgeCount();
      // trigger event
      this.updateStatusEvent.emit('UPDATED');
    }
  }

  // ADMIN update operation
  public async updateOrderStatusAsAdmin(orderId: number, status: string): Promise<void> {
    // validation
    if (this.authService.currentUser?.userRole == ROLE_ADMIN) {
      await this.orderService.updateOrderStatusAdmin(orderId, status); // update status
      // update orders and UI
      this.orders = await this.orderService.getAllOrdersForAdmin();
      this.updateBadgeCount();
      // trigger event
      this.updateStatusEvent.emit('UPDATED');
    }
  }

}
