import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { CheckOutPage } from '../check-out/check-out';
import { LoginPage } from '../login/login';
/**
 * Generated class for the CartPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-cart',
  templateUrl: 'cart.html',
})
export class CartPage {
  cartItems = [];
  total: any;
  showEmptyCartMessage = false;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private storage: Storage,
    private viewCtrl: ViewController) {
    this.total = 0.0;
    this.storage.ready().then(() => {
      this.storage.get('cart')
        .then(data => {
          this.cartItems = data;
          if (this.cartItems.length > 0) {
            this.cartItems.forEach(item => {
              this.total += item.product.price * item.qty;
            })
          } else {
            this.showEmptyCartMessage = true;
          }
        })
    })
  }

  removeFromCart(item, i) {
    const price = item.product.price * item.qty;
    this.cartItems.splice(i, 1);
    this.storage.set('cart', this.cartItems)
      .then(() => {
        this.total -= price;
      })
    if (this.cartItems.length == 0) {
      this.showEmptyCartMessage = true;
    }
  }

  closeModal() {
    this.viewCtrl.dismiss();
  }
  checkout() {
    this.storage.ready()
      .then(() => {
        this.storage.get('userLoginInfo')
          .then(data => {
            if (data) {
              this.navCtrl.push(CheckOutPage);
            } else {
              this.navCtrl.push(LoginPage, { next: data })
            }
          })
      })

  }
}
