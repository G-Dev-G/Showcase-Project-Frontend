import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OrderSuccessPage } from './order-success.page';
import { OrderSuccessPageRoutingModule } from './order-success-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    OrderSuccessPageRoutingModule
  ],
  declarations: [OrderSuccessPage]
})
export class OrderSuccessPageModule {}
