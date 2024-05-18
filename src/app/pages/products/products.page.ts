import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from 'src/app/alert/alert.service';
import { ProductModalComponent } from 'src/app/components/product-modal/product-modal.component';
import { ProductDto } from 'src/app/dtos/ProductDto';
import { ShoppingCartDto } from 'src/app/dtos/ShoppingCartDto';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ProductService } from 'src/app/services/product.service';
import { ShoppingCartService } from 'src/app/services/shopping-cart.service';

@Component({
  selector: 'app-products',
  templateUrl: 'products.page.html',
  styleUrls: ['products.page.scss']
})
export class ProductsPage implements OnInit {

  @ViewChild('categorySelect') categorySelect: ElementRef;
  @ViewChild('sortBySelect') sortBySelect: ElementRef;
  @ViewChild('searchInput') searchInput: ElementRef;
  @ViewChild(MatPaginator) matPaginator: MatPaginator; // pagination

  public productsGot: Array<ProductDto> = []; // products retrieved from DB
  public productToDisplay: Array<ProductDto> = []; // all products that can be displayed
  public productsPerPage: Array<ProductDto> = []; // products that can be displayed per page
  public productPageSize = 12;

  constructor(
    private productService: ProductService,
    private shoppingCartService: ShoppingCartService,
    public authService: AuthenticationService,
    private alertService: AlertService,
    private modalService: NgbModal,
    private router: Router
  ) { }

  async ngOnInit(): Promise<void> {
    await this.getProducts();
  }

  private async getProducts(): Promise<void> {
    this.productsGot = await this.productService.getAllProducts();
    this.productToDisplay = this.productsGot; // clone the products retrieved
    this.refreshPagination();
  }

  public goProductDetail(productId: number): void {
    this.router.navigate(['/products/' + productId]);
  }

  /**
   * Filter and sort products to display
   */
  public async filterAndSortOnChange(): Promise<void> {
    const selectedCategory = this.categorySelect.nativeElement.value;
    const selectedSort = this.sortBySelect.nativeElement.value;

    this.productsGot = await this.productService.getAllProductsByCriteria(selectedCategory, selectedSort);
    this.productToDisplay = this.productsGot; // update UI
    this.refreshPagination();

    // re-call search if input is not empty with every fetch from database
    if (this.searchInput.nativeElement.value != "") {
      this.search();
    }
  }

  public search(): void {
    console.log(this.searchInput.nativeElement.value);
    const searchedVal = (this.searchInput.nativeElement.value as string).toLowerCase();

    this.productToDisplay = []; // clear products on UI and re-push
    this.productsGot.forEach(product => {
      // filter by properties that are visible on UI - case insensitive
      if (product.category.toLowerCase().includes(searchedVal) || product.shortName.toLowerCase().includes(searchedVal) || product.fullName.toLowerCase().includes(searchedVal) ||
        product.price.toString().toLowerCase().includes(searchedVal) || product.description.toLowerCase().includes(searchedVal)) {
        this.productToDisplay.push(product);
      }
    });
    this.refreshPagination();
  }

  /**
   * Add to cart
   * @param productToAdd
   * @returns
   */
  public async addToShoppingCart(productToAdd: ProductDto): Promise<void> {
    // login validation
    if (!this.authService.currentUser) {
      await this.alertService.confirmPrompt("Please login your account first.", 'OK', false);
      return;
    }
    // add to DB
    const itemToAdd = new ShoppingCartDto();
    itemToAdd.productDto = productToAdd;
    itemToAdd.userId = this.authService.currentUser.userId;
    itemToAdd.quantity = 1;
    itemToAdd.checked = true;
    const res = await this.shoppingCartService.addOrUpdateQuantity(itemToAdd);
    // prompt
    if (res != null)
      await this.alertService.successPrompt("Added to cart!");
  }

  // Create new product - Admin
  public createProductModal(): void {
    const modalOptions: NgbModalOptions = {
      size: 'lg',
      beforeDismiss: async () => {
        const res = await this.alertService.confirmPrompt('Changes will not be saved.', 'Close', true);
        return res;
      }
    };
    const productModal = this.modalService.open(ProductModalComponent, modalOptions);
    productModal.result.then(async (resolve) => {
      // refresh
      await this.getProducts();
      await this.alertService.successPrompt("Created successfully!");
    }, (reject) => {
      return;
    });
  }

  // pagination
  public paginationNav($event: PageEvent): void {
    const startIndex = $event.pageIndex * $event.pageSize; // index * size per page
    if (startIndex + $event.pageSize > this.productToDisplay.length) // overflow case
      this.productsPerPage = this.productToDisplay.slice(startIndex);
    else
      this.productsPerPage = this.productToDisplay.slice(startIndex, startIndex + $event.pageSize);
  }

  // refresh productsPerPage whenever productToDisplay is updated
  private refreshPagination(): void {
    if (this.productPageSize > this.productToDisplay.length) // overflow case
      this.productsPerPage = this.productToDisplay.slice();
    else
      this.productsPerPage = this.productToDisplay.slice(0, this.productPageSize);
    // refresh paginator if defined
    if (this.matPaginator)
      this.matPaginator.firstPage();
  }
}
