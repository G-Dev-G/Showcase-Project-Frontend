import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthHttpInterceptor } from './auth/auth-http-interceptor';
import { NgxSpinnerModule } from 'ngx-spinner';
import { TopNavComponent } from './components/top-nav/top-nav.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { OrderDetailModalComponent } from './components/order-detail-modal/order-detail-modal.component';
import { ReviewModalComponent } from './components/review-modal/review-modal.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ProductModalComponent } from './components/product-modal/product-modal.component';
import { OrderStatusModalComponent } from './components/order-status-modal/order-status-modal.component';
import { CheckoutModalComponent } from './components/checkout-modal/checkout-modal.component';
import { ForgotPasswordModalComponent } from './components/forgot-password-modal/forgot-password-modal.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatStepperModule } from '@angular/material/stepper';
import { MatInputModule } from '@angular/material/input';


@NgModule({
  declarations: [
    AppComponent,
    TopNavComponent,
    OrderDetailModalComponent,
    ReviewModalComponent,
    ProductModalComponent,
    OrderStatusModalComponent,
    CheckoutModalComponent,
    ForgotPasswordModalComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    NgxSpinnerModule, // Ngx Spinner
    NgbModule, // Angular Bootstrap
    MatSidenavModule, // Angular Material Sidebar
    MatPaginatorModule, // Angular Material Paginator
    MatExpansionModule, // Angular Material Expansion
    MatMenuModule, // Angular Material Menu
    MatBadgeModule, // Angular Material Badge
    MatButtonModule, // Angular Material Button
    MatStepperModule, // Angular Material Stepper
    MatInputModule // Angular Material Input
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthHttpInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
