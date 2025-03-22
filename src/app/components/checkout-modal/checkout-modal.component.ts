import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { OrderDto } from 'src/app/dtos/OrderDto';
import { OrderItemDto } from 'src/app/dtos/OrderItemDto';
import { ShoppingCartDto } from 'src/app/dtos/ShoppingCartDto';
import { OrderService } from 'src/app/services/order.service';
import { ShoppingCartService } from 'src/app/services/shopping-cart.service';

declare const paypal; // declare paypal object

@Component({
  selector: 'app-checkout-modal',
  templateUrl: './checkout-modal.component.html',
  styleUrls: ['./checkout-modal.component.scss']
})
export class CheckoutModalComponent implements OnInit, AfterViewInit {
  @Input() orderToAdd: OrderDto;
  @Input() shoppingCartItems?: Array<ShoppingCartDto>;

  @ViewChild("paypalBtn") paypalBtn: ElementRef;

  public infoForm: FormGroup;
  public orderItemListPerPage: Array<OrderItemDto> = []; // list to display per page
  public pageSize = 3;

  constructor(public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private shoppingCartService: ShoppingCartService,
    private orderService: OrderService) {}

  ngOnInit(): void {
    this.infoForm = this.formBuilder.group({
      fullName: [this.orderToAdd.userDto?.name != null ? this.orderToAdd.userDto?.name : '', Validators.required],
      address: [this.orderToAdd.userDto?.address != null ? this.orderToAdd.userDto?.address : '', Validators.required]
    });
    // pagination display init
    this.orderItemListPerPage = this.orderToAdd.orderItemDtoList.slice(0, this.pageSize);
  }

  async ngAfterViewInit(): Promise<void> {
    // paypal processing
    await paypal.Buttons({
      createOrder: (data, actions) => {
        return actions.order.create({
          purchase_units: [{
            amount: {
              value: "0.01"
            }
          }]
        });
      },
      onApprove: (data, actions) => {
        return actions.order.capture().then(async () => {
          await this.placeOrder();
        });
      }
    }).render(this.paypalBtn.nativeElement);
  }

  // nav back and forth through pagination
  public paginationNav($event: PageEvent): void {
    const startIndex = $event.pageIndex * $event.pageSize; // index * size per page

    if (startIndex + $event.pageSize > this.orderToAdd.orderItemDtoList.length) // overflow case
      this.orderItemListPerPage = this.orderToAdd.orderItemDtoList.slice(startIndex);
    else
      this.orderItemListPerPage = this.orderToAdd.orderItemDtoList.slice(startIndex, startIndex + $event.pageSize);
  }

  // get total price
  public getOrderTotalPrice(): number {
    let price = 0;
    this.orderToAdd.orderItemDtoList.forEach(item => {
      price += item.productDto?.price * item.quantity;
    });
    return price * 1.13;
  }

  // place order
  public async placeOrder(): Promise<void> {
    // add fullName and address to the order
    this.orderToAdd.userFullName = this.infoForm.get('fullName').value;
    this.orderToAdd.address = this.infoForm.get('address').value;
    await this.orderService.addOrder(this.orderToAdd); // place order

    // delete each checked shopping cart item if ordered in cart page
    if (this.shoppingCartItems != null) {
      for (const item of this.shoppingCartItems) {
        if (item.checked) {
          // remove each item from shopping cart
          await this.shoppingCartService.deleteShoppingCart(item.shoppingCartId);
        }
      }
    }

    // reload to success page
    location.href = "/order-success";
  }
}
