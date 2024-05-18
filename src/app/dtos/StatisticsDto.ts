export class StatisticsDto {
    public productId: number;
    public shortName: string;
    public category: string;
    public sum: number;

    constructor() {
      this.productId = null;
      this.shortName = null;
      this.category = null;
      this.sum = null;
    }
}
