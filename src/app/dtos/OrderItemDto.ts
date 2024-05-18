import { ProductDto } from "./ProductDto";
import { ReviewDto } from "./ReviewDto";

export class OrderItemDto {
  public orderItemId: number;
  public productDto: ProductDto;
  public quantity: number;
  public reviewDto?: ReviewDto; // added prop to access

  constructor() {
    this.orderItemId = null;
    this.productDto = null;
    this.quantity = null;
    this.reviewDto = null;
  }
}
