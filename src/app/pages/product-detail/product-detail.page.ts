import { Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from 'src/app/alert/alert.service';
import { CheckoutModalComponent } from 'src/app/components/checkout-modal/checkout-modal.component';
import { ProductModalComponent } from 'src/app/components/product-modal/product-modal.component';
import { FavoriteDto } from 'src/app/dtos/FavoriteDto';
import { OrderDto, PENDING_STATUS } from 'src/app/dtos/OrderDto';
import { OrderItemDto } from 'src/app/dtos/OrderItemDto';
import { ProductDto } from 'src/app/dtos/ProductDto';
import { ReviewDto } from 'src/app/dtos/ReviewDto';
import { ShoppingCartDto } from 'src/app/dtos/ShoppingCartDto';
import { ROLE_USER } from 'src/app/dtos/UserDto';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { FavoriteService } from 'src/app/services/favorite.service';
import { FlaggedReviewService } from 'src/app/services/flagged-review.service';
import { ProductService } from 'src/app/services/product.service';
import { ReviewService } from 'src/app/services/review.service';
import { ShoppingCartService } from 'src/app/services/shopping-cart.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: 'product-detail.page.html',
  styleUrls: ['product-detail.page.scss'],
})
export class ProductDetailPage implements OnInit {
  public product: ProductDto = new ProductDto();
  public productImageUrls: Array<string> = [];
  public productQuantity = 1; // initial quantity selected
  public isUserFavorite = false;
  public reviews: Array<ReviewDto> = []; // reviews of the product
  @ViewChild(MatPaginator) paginator: MatPaginator;
  public reviewsPerPage: Array<ReviewDto> = []; // reviews to display per page
  public reviewPageSize = 5;
  private reviewsFlaggedByUser: Array<ReviewDto> = []; // reviews of the product flagged by signed in user
  public overallRating = 0;

  constructor(
    private productService: ProductService,
    private shoppingCartService: ShoppingCartService,
    private favoriteService: FavoriteService,
    public authService: AuthenticationService,
    private reviewService: ReviewService,
    private flaggedReviewService: FlaggedReviewService,
    private alertService: AlertService,
    private modalService: NgbModal,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private location: Location) {
  }

  async ngOnInit(): Promise<void> {
    // get productId through url param
    const productId = Number(this.activatedRoute.snapshot.paramMap.get('productId'));
    await this.getProductDetails(productId);

    // retrieve reviews under this product
    this.reviews = await this.reviewService.getAllReviewsByProductId(productId);
    this.reviewsPerPage = this.reviews.slice(0, this.reviewPageSize);

    // get reviews flagged by user
    await this.getReviewsOfProductFlaggedByUser(productId);

    // get average rating of the product
    let totalRating = 0;
    this.reviews.forEach(review => {
      totalRating += review.rating;
    });
    this.overallRating = totalRating / this.reviews.length;

    // Define Favorite Icon
    if (await this.inUserFavorites())
      this.isUserFavorite = true;
    else
      this.isUserFavorite = false;
  }

  // get product and rendering
  private async getProductDetails(productId: number): Promise<void> {
    // get product
    this.product = await this.productService.getProductById(productId);
    // push image urls
    this.productImageUrls = [];
    this.product.images.forEach(image => {
      this.productImageUrls.push('data:image/png;base64,' + image);
    });
    // render product description
    document.getElementById("descriptionContent").innerHTML = ""; // reset
    let textPerLine = "";
    for (let i = 0; i < this.product.description.length; i++) {
      textPerLine += this.product.description[i];
      // detect period separation
      if ((this.product.description[i] == '.' && i < this.product.description.length - 1 && this.product.description[i + 1] == ' ') ||
        (this.product.description[i] == '.' && i == this.product.description.length - 1)) {
        // append html element
        document.getElementById("descriptionContent").innerHTML += "<p class='my-1'>" + textPerLine + "</p>";
        textPerLine = "";
      }
    }
    // in case there is no period
    if (textPerLine != "") {
      document.getElementById("descriptionContent").innerHTML += "<p class='my-1'>" + textPerLine + "</p>";
    }
  }

  // get flagged reviews
  private async getReviewsOfProductFlaggedByUser(productId: number): Promise<void> {
    // not signed in
    if (!this.authService.currentUser)
      return;
    // signed in user role validation
    if (this.authService.currentUser.userRole == ROLE_USER)
      this.reviewsFlaggedByUser = await this.flaggedReviewService.getReviewsFlaggedByUserIdAndProductId(this.authService.currentUser.userId, productId);
  }

  // navigate back to previous page
  public navBack(): void {
    this.location.back();
  }

  // reviews - nav back and forth through pagination
  paginationNav($event: PageEvent): void {
    const startIndex = $event.pageIndex * $event.pageSize; // index * size per page

    if (startIndex + $event.pageSize > this.reviews.length) // overflow case
      this.reviewsPerPage = this.reviews.slice(startIndex);
    else
      this.reviewsPerPage = this.reviews.slice(startIndex, startIndex + $event.pageSize);
  }

  // order now
  public async orderProduct(): Promise<void> {
    // login validation
    if (!this.authService.currentUser) {
      await this.alertService.confirmPrompt("Please login your account first.", 'OK', false);
      return;
    }
    // create new order
    const orderToAdd: OrderDto = new OrderDto();
    orderToAdd.userDto = this.authService.currentUser;
    orderToAdd.orderDate = new Date();
    orderToAdd.status = PENDING_STATUS;
    orderToAdd.statusCheckedByUserLastTime = PENDING_STATUS;
    orderToAdd.orderItemDtoList = [];
    // construct order item
    const orderItem: OrderItemDto = new OrderItemDto();
    orderItem.productDto = this.product;
    orderItem.quantity = this.productQuantity;
    orderToAdd.orderItemDtoList.push(orderItem);

    // open checkout modal
    const modalOptions: NgbModalOptions = {
      size: 'lg'
    };
    const reviewModal = this.modalService.open(CheckoutModalComponent, modalOptions);
    // pass order to add
    reviewModal.componentInstance.orderToAdd = orderToAdd;
  }

  // Shopping Cart
  public async addToShoppingCart(): Promise<void> {
    // login validation
    if (!this.authService.currentUser) {
      await this.alertService.confirmPrompt("Please login your account first.", 'OK', false);
      return;
    }
    // add
    const itemToAdd = new ShoppingCartDto();
    itemToAdd.productDto = this.product;
    itemToAdd.userId = this.authService.currentUser.userId;
    itemToAdd.quantity = this.productQuantity;
    itemToAdd.checked = true;
    const res = await this.shoppingCartService.addOrUpdateQuantity(itemToAdd);
    // prompt
    if (res != null)
      await this.alertService.successPrompt("Added to cart!");
  }

  // Quantity
  public reduceQuantity(): void {
    if (this.productQuantity > 1)
      this.productQuantity = this.productQuantity - 1;
  }

  public addQuantity(): void {
    if (this.productQuantity < 10)
      this.productQuantity = this.productQuantity + 1;
  }

  // Favorite
  public async toggleFavorite(): Promise<void> {
    // login validation
    if (!this.authService.currentUser) {
      await this.alertService.confirmPrompt("Please login your account first.", 'OK', false);
      return;
    }
    // get all favorite items for the logged in user
    const userFavorites = await this.favoriteService.getAllFavoritesByUserId(this.authService.currentUser.userId);

    // iterate favorite items and compare product ID
    for (const favorite of userFavorites) {
      // if the current product is already in favorite, remove it
      if (this.product.productId == favorite.productDto.productId) {
        await this.favoriteService.deleteFavorite(favorite.favoriteId);
        this.isUserFavorite = false;
        return;
      }
    }

    // add the product into favorite if it was not existing
    const itemToToggle = new FavoriteDto();
    itemToToggle.productDto = this.product;
    itemToToggle.userId = this.authService.currentUser.userId;

    await this.favoriteService.addFavorite(itemToToggle);
    this.isUserFavorite = true;
  }

  /**
   * Validate if the product is in logged in user favorites
   * @returns boolean
   */
  private async inUserFavorites(): Promise<boolean> {
    if (!this.authService.currentUser)
      return false;
    // get all favorite items for the logged in user
    const userFavorites = await this.favoriteService.getAllFavoritesByUserId(this.authService.currentUser.userId);

    // iterate favorite items and compare product ID
    for (const favorite of userFavorites) {
      // return true if the current product is already in favorite
      if (this.product.productId == favorite.productDto.productId) {
        return true;
      }
    }
    return false;
  }

  /**
   * Add or Delete flag of the review - User
   * @param reviewId
   */
  public async toggleReviewFlag(reviewId: number): Promise<void> {
    // login validation
    if (!this.authService.currentUser) {
      await this.alertService.confirmPrompt("Please login your account first.", 'OK', false);
      return;
    }
    if (this.authService.currentUser.userRole == ROLE_USER) {
      // toggle
      await this.flaggedReviewService.toggleFlagByUserIdAndReviewId(this.authService.currentUser.userId, reviewId);
      // refresh
      this.reviews = await this.reviewService.getAllReviewsByProductId(this.product.productId);
      await this.getReviewsOfProductFlaggedByUser(this.product.productId);

      const startIndex = this.paginator.pageIndex * this.reviewPageSize;
      if (startIndex + this.reviewPageSize > this.reviews.length)
        this.reviewsPerPage = this.reviews.slice(startIndex);
      else
        this.reviewsPerPage = this.reviews.slice(startIndex, startIndex + this.reviewPageSize);
    }
  }

  /**
   * check if the review is in the reviewsFlaggedByUser array
   * @param reviewId
   * @returns boolean
   */
  public isFlaggedByUser(reviewId: number): boolean {
    for (const flaggedReview of this.reviewsFlaggedByUser) {
      if (flaggedReview.reviewId == reviewId)
        return true;
    }
    return false;
  }

  /**
   * Edit product - Admin
   */
  public editProductModal(): void {
    const modalOptions: NgbModalOptions = {
      size: 'lg',
      beforeDismiss: async () => {
        const res = await this.alertService.confirmPrompt('Changes will not be saved.', 'Close', true);
        return res;
      }
    };
    const productModal = this.modalService.open(ProductModalComponent, modalOptions);
    productModal.componentInstance.productDto = this.product;

    productModal.result.then(async (resolve) => {
      // refresh the product
      const productId = Number(this.activatedRoute.snapshot.paramMap.get('productId'));
      await this.getProductDetails(productId);
      await this.alertService.successPrompt("Updated successfully!");
    }, (reject) => {
      return;
    });
  }

  /**
   * Delete product - Admin
   */
  public async deleteProduct(): Promise<void> {
    const res = await this.alertService.confirmPrompt("Confirm to delete this product.", 'Delete', true, 'warning');
    if (res) {
      const productId = Number(this.activatedRoute.snapshot.paramMap.get('productId'));
      await this.productService.deleteProduct(productId); // delete
      // load back to home page
      this.router.navigate(['/products']);
      await this.alertService.successPrompt("Product deleted!");
    }
  }

}
