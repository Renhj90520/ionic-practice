import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, ModalController } from 'ionic-angular';
import * as WC from 'woocommerce-api';
import { Storage } from '@ionic/storage';
import { CartPage } from '../cart/cart';

/**
 * Generated class for the ProductDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-product-details',
  templateUrl: 'product-details.html',
})
export class ProductDetailsPage {
  product: any;
  WooCommerce: any;
  reviews = [];
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private storage: Storage,
    private toastCtrl: ToastController,
    private modalCtrl: ModalController) {
    this.product = navParams.get('product');
    this.WooCommerce = WC({
      url: 'http://192.168.1.101:9000',
      consumerKey: 'ck_399e245a41820a43d8108b06d249cc16b4c2e416',
      consumerSecret: 'cs_e30d2a9f74899438b4022c6dd13a0a037f95f862'
    });

    this.WooCommerce.getAsync('products/' + this.product.id + '/reviews')
      .then(data => {
        this.reviews = JSON.parse(data.body).product_reviews;
      }, err => {
        console.log(err);
      })
  }

  addToCart(prod) {
    this.storage.get('cart')
      .then(data => {

        if (data == null || data.length === 0) {
          data = [];
          data.push({
            product: prod,
            qty: 1,
            amount: parseFloat(prod.price)
          });
        } else {
          let added = 0;
          data.forEach(p => {
            if (prod.id === p.product.id) {
              p.qty += 1;
              p.amount = parseFloat(p.amount) + parseFloat(p.product.price);
              added = 1;
            }
          });
          if (added === 0) {
            data.push({
              product: prod,
              qty: 1,
              amount: parseFloat(prod.price)
            });
          }
        }

        this.storage.set('cart', data)
          .then(() => {
            this.toastCtrl.create({
              message: 'Cart Updated',
              duration: 3000
            }).present();
          })
      })
  }

  openCart() {
    this.modalCtrl.create(CartPage)
      .present();
  }
}
