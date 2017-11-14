import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import * as WC from 'woocommerce-api';
import { ProductDetailsPage } from '../product-details/product-details';
/**
 * Generated class for the ProductsByCategoryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-products-by-category',
  templateUrl: 'products-by-category.html',
})
export class ProductsByCategoryPage {
  products = [];
  WooCommerce: any;
  category: any;
  page: number;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.page = 1;
    this.category = navParams.get('category');
    this.WooCommerce = WC({
      url: 'http://192.168.1.101:9000',
      consumerKey: 'ck_399e245a41820a43d8108b06d249cc16b4c2e416',
      consumerSecret: 'cs_e30d2a9f74899438b4022c6dd13a0a037f95f862'
    });

    this.loadMoreProducts(null);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProductsByCategoryPage');
  }

  loadMoreProducts(event) {
    if (event == null) {
      this.page = 1;
    } else {
      this.page++;
    }
    this.WooCommerce.getAsync('products?filter[category]=' + this.category.slug + '&page=' + this.page)
      .then(data => {
        const temp = JSON.parse(data.body).products;
        this.products = this.products.concat(temp);
        if (event != null) {
          event.complete();
          if (temp.length < 10) {
            event.enable(false);
          }
        }
      }, err => {
        console.log(err);
      })
  }

  openProductPage(prod) {
    this.navCtrl.push(ProductDetailsPage, { product: prod });
  }
}
