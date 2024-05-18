import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from 'src/app/alert/alert.service';
import { OrderDto } from 'src/app/dtos/OrderDto';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { OrderStatusModalComponent } from '../order-status-modal/order-status-modal.component';

@Component({
  selector: 'app-top-nav',
  templateUrl: './top-nav.component.html',
  styleUrls: ['./top-nav.component.scss']
})
export class TopNavComponent {
  @Input() orders: Array<OrderDto> = [];
  @Input() notificationCount: number = 0;
  @Output() statusUpdatedEvent = new EventEmitter<string>();

  constructor(
    public router: Router,
    public authService: AuthenticationService,
    private alertService: AlertService,
    private modalService: NgbModal
  ) { }

  public async logout(): Promise<void> {
    // confirm to logout
    if (await this.alertService.confirmPrompt('Are you sure to logout?', 'Logout', true))
      await this.authService.logout();
  }

  public openOrderStatus(): void {
    // modal settings
    const modalOptions: NgbModalOptions = {
      size: 'xl',
      scrollable: true
    };
    // open modal
    const orderStatusModal = this.modalService.open(OrderStatusModalComponent, modalOptions);
    orderStatusModal.componentInstance.orders = this.orders;
    // subscribe updateStatusEvent in modal
    orderStatusModal.componentInstance.updateStatusEvent.subscribe($event => {
      this.statusUpdatedEvent.emit($event); // emit event to parent component to refresh input
    })
  }
}
