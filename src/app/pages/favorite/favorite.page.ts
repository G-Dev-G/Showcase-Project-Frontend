import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FavoriteDto } from 'src/app/dtos/FavoriteDto';
import { ShoppingCartDto } from 'src/app/dtos/ShoppingCartDto';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { FavoriteService } from 'src/app/services/favorite.service';
import { ProductService } from 'src/app/services/product.service';
import { ShoppingCartService } from 'src/app/services/shopping-cart.service';

@Component({
  selector: 'app-favorite',
  templateUrl: 'favorite.page.html',
  styleUrls: ['favorite.page.scss'],
})
export class FavoritePage implements OnInit {
  public favoriteItems: Array<FavoriteDto> = [];

  constructor(
    private favoriteService: FavoriteService,
    private shoppingCartService: ShoppingCartService,
    private productService: ProductService,
    private authService: AuthenticationService,
    private router: Router) {
  }

  async ngOnInit(): Promise<void> {
    await this.renderAllFavoriteItemsByUserId();
  }

  private async renderAllFavoriteItemsByUserId(): Promise<void> {
    // get all shopping cart items for logged in user
    this.favoriteItems = await this.favoriteService.getAllFavoritesByUserId(this.authService.currentUser?.userId);
    console.log(this.favoriteItems);
  }

  public async deleteFavorite(favoriteId: number): Promise<void> {
    console.log(favoriteId);
    await this.favoriteService.deleteFavorite(favoriteId);
    // update UI after deletion
    await this.renderAllFavoriteItemsByUserId();
  }

  // Move item to shopping cart
  public async moveToCart(favoriteItem: FavoriteDto): Promise<void> {
    await this.favoriteService.deleteFavorite(favoriteItem.favoriteId); // remove from favorite

    // add product to shopping cart
    const itemToAdd = new ShoppingCartDto();
    itemToAdd.productDto = favoriteItem.productDto;
    itemToAdd.userId = this.authService.currentUser?.userId;
    itemToAdd.quantity = 1;
    itemToAdd.checked = true;
    await this.shoppingCartService.addOrUpdateQuantity(itemToAdd);

    // refresh
    await this.renderAllFavoriteItemsByUserId();
  }

  public navToProductDetail(productId: number): void {
    this.router.navigate(['/products/' + productId]);
  }

}
