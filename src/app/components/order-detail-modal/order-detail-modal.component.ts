import { Component, Input, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { OrderDto } from 'src/app/dtos/OrderDto';
import { OrderItemDto } from 'src/app/dtos/OrderItemDto';

@Component({
  selector: 'app-order-detail-modal',
  templateUrl: './order-detail-modal.component.html',
  styleUrls: ['./order-detail-modal.component.scss']
})
export class OrderDetailModalComponent implements OnInit {
  @Input() orderDto: OrderDto;

  public orderItemListPerPage: Array<OrderItemDto> = []; // list to display per page
  public pageSize = 3;

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
    this.orderItemListPerPage = this.orderDto.orderItemDtoList.slice(0, this.pageSize);
  }

  // nav back and forth through pagination
  paginationNav($event: PageEvent): void {
    const startIndex = $event.pageIndex * $event.pageSize; // index * size per page

    if (startIndex + $event.pageSize > this.orderDto.orderItemDtoList.length) // overflow case
      this.orderItemListPerPage = this.orderDto.orderItemDtoList.slice(startIndex);
    else
      this.orderItemListPerPage = this.orderDto.orderItemDtoList.slice(startIndex, startIndex + $event.pageSize);
  }

  // get total price
  public getOrderTotalPrice(): number {
    let price = 0;
    this.orderDto.orderItemDtoList.forEach(item => {
      price += item.productDto?.price * item.quantity;
    });
    return price * 1.13;
  }
}
