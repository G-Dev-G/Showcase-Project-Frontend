import { ProductDto } from "./ProductDto";

export class ShoppingCartDto {
  public shoppingCartId: number;
  public productDto: ProductDto;
  public userId: number;
  public quantity: number;
  public checked: boolean;

  constructor() {
    this.shoppingCartId = null;
    this.productDto = null;
    this.userId = null;
    this.quantity = null;
    this.checked = false;
  }
}
