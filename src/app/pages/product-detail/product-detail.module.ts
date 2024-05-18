import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProductDetailPage } from './product-detail.page';
import { ProductDetailPageRoutingModule } from './product-detail-routing.module';
import { CarouselComponent } from '../../components/carousel/carousel.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule } from '@angular/material/paginator';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ProductDetailPageRoutingModule,
    NgbModule, // Angular Bootstrap
    MatButtonModule, // Angular Material Button
    MatPaginatorModule // Angular Material Paginator
  ],
  declarations: [
    ProductDetailPage,
    CarouselComponent
  ]
})
export class ProductDetailPageModule {}
