import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-order-success',
  templateUrl: 'order-success.page.html',
  styleUrls: ['order-success.page.scss'],
})
export class OrderSuccessPage implements OnInit {

  constructor() { }

  ngOnInit(): void {
    sessionStorage.removeItem('orderId'); // remove orderId to prevent page from being re-activated
  }

}
