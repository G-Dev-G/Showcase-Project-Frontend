import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { OrderDto } from 'src/app/dtos/OrderDto';
import { ROLE_ADMIN, ROLE_USER } from 'src/app/dtos/UserDto';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { OrderService } from 'src/app/services/order.service';
import { OrderDetailModalComponent } from '../order-detail-modal/order-detail-modal.component';
import { ReviewModalComponent } from '../review-modal/review-modal.component';

@Component({
  selector: 'app-account-order-history',
  templateUrl: './account-order-history.component.html',
  styleUrls: ['./account-order-history.component.scss']
})
export class AccountOrderHistoryComponent implements AfterViewInit {
  public orders: Array<OrderDto> = [];

  // Table Config
  @ViewChild(MatPaginator) matPaginator: MatPaginator; // pagination
  @ViewChild(MatSort) matSort: MatSort; // sort
  public dataSource = new MatTableDataSource();
  public columnsToDisplayForUser: string[] = ['orderId', 'productImgs', 'price', 'orderDate', 'status', 'review'];
  public columnsToDisplayForAdmin: string[] = ['orderId', 'usernameEmail', 'productImgs', 'price', 'orderDate', 'status'];

  constructor(
    private orderService: OrderService,
    public authService: AuthenticationService,
    private modalService: NgbModal) { }

  async ngAfterViewInit(): Promise<void> {
    await this.retrieveOrders();
    this.dataSourceConfig();
  }

  private async retrieveOrders(): Promise<void> {
    // get all orders for logged in user
    if (this.authService.currentUser?.userRole == ROLE_USER)
      this.orders = await this.orderService.getAllOrdersByUserId(this.authService.currentUser?.userId);
    // get all orders for admin
    if (this.authService.currentUser?.userRole == ROLE_ADMIN)
      this.orders = await this.orderService.getAllOrdersForAdmin();
  }

  private dataSourceConfig(): void {
    this.dataSource = new MatTableDataSource(this.orders); // data source for mat-table

    // override the default data accessor to custom user email and order price sort
    this.dataSource.sortingDataAccessor = (data: OrderDto, headerId: string) => {
      if (headerId == 'usernameEmail')
        return data.userDto?.usernameEmail;
      if (headerId == 'price')
        return this.getOrderPrice(data);
      return data[headerId];
    }
    this.dataSource.sort = this.matSort; // sort config
    this.dataSource.paginator = this.matPaginator; // pagination config
  }

  // Click table record event
  public openOrderDetail(rowData: OrderDto): void {
    // open modal
    const orderDetailModal = this.modalService.open(OrderDetailModalComponent);
    orderDetailModal.componentInstance.orderDto = rowData;
  }

  // Get order price
  public getOrderPrice(order: OrderDto): number {
    let price = 0;
    order.orderItemDtoList.forEach(item => {
      price += item.productDto?.price * item.quantity;
    });
    return price * 1.13;
  }

  // Check if the order has review in it - return code that represents each case
  public hasReview(order: OrderDto): number {
    // every item has review (Completed)
    if (order.orderItemDtoList.every(item => item.reviewDto != null)) {
      return 1;
    }
    for (const orderItem of order.orderItemDtoList) {
      // some items have review (Partial)
      if (orderItem.reviewDto != null)
        return 0;
    }
    // no item has review (Incompleted)
    return -1;
  }

  // Review
  public async openReviewModal($event: Event, orderDto: OrderDto): Promise<void> {
    $event.stopPropagation(); // prevent openOrderDetail event
    const reviewModal = this.modalService.open(ReviewModalComponent);
    reviewModal.componentInstance.orderDto = orderDto;

    reviewModal.result.then(async (resolve) => {
      // refresh data source when modal is closed
      await this.retrieveOrders();
      this.dataSourceConfig();
    }, (reject) => {
      return;
    });
  }
}
