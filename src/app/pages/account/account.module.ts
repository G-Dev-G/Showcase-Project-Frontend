import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AccountPage } from './account.page';
import { AccountPageRoutingModule } from './account-routing.module';
import { AccountGeneralInfoComponent } from 'src/app/components/account-general-info/account-general-info.component';
import { AccountSecurityComponent } from 'src/app/components/account-security/account-security.component';
import { AccountOrderHistoryComponent } from 'src/app/components/account-order-history/account-order-history.component';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AccountPageRoutingModule,
    MatTableModule, // Angular Material Table
    MatSortModule, // Angular Material Sort
    MatPaginatorModule, // Angular Material Paginator
    MatButtonModule // Angular Material Button
  ],
  declarations: [
    AccountPage,
    AccountGeneralInfoComponent,
    AccountSecurityComponent,
    AccountOrderHistoryComponent
  ]
})
export class AccountPageModule { }
