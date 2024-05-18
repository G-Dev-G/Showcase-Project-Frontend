import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/auth/auth-guard';
import { ProductsPage } from './products.page';


const routes: Routes = [
  {
    path: ':productId',
    loadChildren: () => import('../product-detail/product-detail.module').then(m => m.ProductDetailPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: '',
    component: ProductsPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsPageRoutingModule {}
