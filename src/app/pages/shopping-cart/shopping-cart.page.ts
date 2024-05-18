import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from 'src/app/alert/alert.service';
import { CheckoutModalComponent } from 'src/app/components/checkout-modal/checkout-modal.component';
import { OrderDto, PENDING_STATUS } from 'src/app/dtos/OrderDto';
import { OrderItemDto } from 'src/app/dtos/OrderItemDto';
import { ShoppingCartDto } from 'src/app/dtos/ShoppingCartDto';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ShoppingCartService } from 'src/app/services/shopping-cart.service';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: 'shopping-cart.page.html',
  styleUrls: ['shopping-cart.page.scss'],
})
export class ShoppingCartPage implements OnInit {
  public shoppingCartItems: Array<ShoppingCartDto> = [];
  constructor(
    private shoppingCartService: ShoppingCartService,
    private authService: AuthenticationService,
    private alertService: AlertService,
    private modalService: NgbModal,
    private router: Router
  ) { }

  async ngOnInit(): Promise<void> {
    await this.renderAllShoppingCartItemsByUserId();
  }

  // Get shopping cart
  private async renderAllShoppingCartItemsByUserId(): Promise<void> {
    // get all shopping cart items for logged in user
    this.shoppingCartItems = await this.shoppingCartService.getAllShoppingCartsByUserId(this.authService.currentUser?.userId);
  }

  // quantity boundary validation
  public limitQuantity(item: ShoppingCartDto, $event): void {
    if ($event.target.value > 10) {
      $event.target.value = 10;
      item.quantity = 10;
    }
    if ($event.target.value < 1) {
      $event.target.value = 1;
      item.quantity = 1;
    }
  }

  // quantity integer validation
  public roundQuantity(item: ShoppingCartDto, $event): void {
    $event.target.value = Math.round($event.target.value);
    item.quantity = $event.target.value;
  }

  // update when quantity or checked is changed
  public async updateShoppingCart(item: ShoppingCartDto): Promise<void> {
    await this.shoppingCartService.updateShoppingCart(item);
  }

  // remove item from shopping cart
  public async deleteShoppingCart(shoppingCartId: number): Promise<void> {
    // delete
    await this.shoppingCartService.deleteShoppingCart(shoppingCartId);
    // update UI after deletion
    await this.renderAllShoppingCartItemsByUserId();
  }

  // nav to product detail onclick the image
  public navToProductDetail(productId: number): void {
    this.router.navigate(['/products/' + productId]);
  }

  // calculate the subtotal price
  public calculateSubTotal(): number {
    let price = 0;
    this.shoppingCartItems.forEach(item => {
      // sum up checked items
      if (item.checked)
        price += item.productDto?.price * item.quantity;
    });
    return price;
  }

  // to disable button if there is no item selected (checked)
  public hasNoCheckedItem(): boolean {
    for (const item of this.shoppingCartItems) {
      if (item.checked)
        return false;
    }
    return true;
  }

  // check all items in shopping cart
  public async selectAllItems(): Promise<void> {
    await this.shoppingCartService.checkAllShoppingCartsByUserId(this.authService.currentUser?.userId);
    // update UI
    await this.renderAllShoppingCartItemsByUserId();
  }

  // un-check all items in shopping cart
  public async deselectAllItems(): Promise<void> {
    await this.shoppingCartService.unCheckAllShoppingCartsByUserId(this.authService.currentUser?.userId);
    // update UI
    await this.renderAllShoppingCartItemsByUserId();
  }

  // delete all items in shopping cart
  public async deleteAllItems(): Promise<void> {
    // confirm to delete all
    if (await this.alertService.confirmPrompt('Confirm to delete all.', 'Delete', true, 'warning')) {
      await this.shoppingCartService.clearShoppingCartByUserId(this.authService.currentUser?.userId);
      // update UI after deletion
      await this.renderAllShoppingCartItemsByUserId();
    }
  }

  // checkout
  public checkout(): void {
    // create new order
    const orderToAdd: OrderDto = new OrderDto();
    orderToAdd.userDto = this.authService.currentUser;
    orderToAdd.orderDate = new Date();
    orderToAdd.status = PENDING_STATUS;
    orderToAdd.statusCheckedByUserLastTime = PENDING_STATUS;

    // foreach checked shopping cart item, add to orderItemList
    orderToAdd.orderItemDtoList = [];
    for (const item of this.shoppingCartItems) {
      if (item.checked) {
        // construct order item
        const orderItem: OrderItemDto = new OrderItemDto();
        orderItem.productDto = item.productDto;
        orderItem.quantity = item.quantity;
        orderToAdd.orderItemDtoList.push(orderItem);
      }
    }

    // open checkout modal
    const modalOptions: NgbModalOptions = {
      size: 'lg'
    };
    const reviewModal = this.modalService.open(CheckoutModalComponent, modalOptions);
    // pass order to add and shopping cart items to delete
    reviewModal.componentInstance.orderToAdd = orderToAdd;
    reviewModal.componentInstance.shoppingCartItems = this.shoppingCartItems;
  }

}
