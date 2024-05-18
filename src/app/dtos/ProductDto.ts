import { Byte } from "@angular/compiler/src/util";

export class ProductDto {
  public productId: number;
  public shortName: string;
  public fullName: string;
  public description: string;
  public price: number;
  public category: string;
  public images: Array<Byte[]>;

  constructor() {
    this.productId = null;
    this.shortName = null;
    this.fullName = null;
    this.description = null;
    this.price = null;
    this.category = null;
    this.images = [];
  }
}
