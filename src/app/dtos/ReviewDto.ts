export class ReviewDto {
  public reviewId: number;
  public orderItemId: number;
  public rating: number;
  public comment: string;
  public reviewDate: Date;
  public userName?: string; // added prop to access
  public flaggedCount?: number; // added prop to access

  constructor() {
    this.reviewId = null;
    this.orderItemId = null;
    this.rating = null;
    this.comment = null;
    this.reviewDate = null;
    this.userName = null;
    this.flaggedCount = null;
  }
}
