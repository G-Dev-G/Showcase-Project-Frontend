import { ProductDto } from "./ProductDto";

export class FavoriteDto {
  public favoriteId: number;
  public productDto: ProductDto;
  public userId: number;

  constructor() {
    this.favoriteId = null;
    this.productDto = null;
    this.userId = null;
  }
}
