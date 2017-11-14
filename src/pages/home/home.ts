import { Component, ViewChild } from '@angular/core';
import { NavController, Slides, ToastController } from 'ionic-angular';
import * as WC from 'woocommerce-api';
import { ProductDetailsPage } from '../product-details/product-details';
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  WooCommerce: any;
  products = [];
  moreProducts = [];
  page: number;
  @ViewChild('slides') slides: Slides;
  constructor(public navCtrl: NavController, private toastCtrl: ToastController) {
    this.page = 2;
    this.WooCommerce = WC({
      url: 'http://192.168.1.101:9000',
      consumerKey: 'ck_399e245a41820a43d8108b06d249cc16b4c2e416',
      consumerSecret: 'cs_e30d2a9f74899438b4022c6dd13a0a037f95f862'
    });

    this.loadMoreProducts(null);

    this.WooCommerce.getAsync('products').then(data => {
      this.products = JSON.parse(data.body).products;
    }, err => {
      console.log(err);
    });
  }

  ionViewDidLoad() {
    setInterval(() => {
      if (this.slides.getActiveIndex() === (this.products.length - 1))
        this.slides.slideTo(0);
      this.slides.slideNext();
    }, 3000);
  }

  loadMoreProducts(event) {
    if (event == null) {
      this.page = 2;
    }
    else {
      this.page++;
    }
    this.WooCommerce.getAsync('products?page=' + this.page).then(data => {
      this.moreProducts = this.moreProducts.concat(JSON.parse(data.body).products);

      if (event != null) {
        event.complete();
      }

      if (JSON.parse(data.body).products.length < 10) {
        event.enable(false);
        this.toastCtrl.create({
          message: 'No more products!',
          duration: 3000
        }).present();
      }
    }, err => {
      console.log(err);
    })
  }

  openProductPage(prod) {
    this.navCtrl.push(ProductDetailsPage, { product: prod });
  }
}
