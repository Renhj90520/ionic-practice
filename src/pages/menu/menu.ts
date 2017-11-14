import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { HomePage } from '../home/home';
import * as WC from 'woocommerce-api';
import { ProductsByCategoryPage } from '../products-by-category/products-by-category';
import { SignUpPage } from '../sign-up/sign-up';
import { LoginPage } from '../login/login';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the MenuPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html',
})
export class MenuPage {
  homePage: any;
  WooCommerce: any;
  categories = [];

  loggedIn: boolean;
  user: any;

  @ViewChild('content') childNavCtrl: NavController;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    private storage: Storage) {
    this.homePage = HomePage;
    this.WooCommerce = WC({
      url: 'http://192.168.1.101:9000',
      consumerKey: 'ck_399e245a41820a43d8108b06d249cc16b4c2e416',
      consumerSecret: 'cs_e30d2a9f74899438b4022c6dd13a0a037f95f862'
    });

    this.WooCommerce.getAsync('products/categories')
      .then(data => {
        const cates = JSON.parse(data.body).product_categories;
        cates.forEach(cate => {
          if (cate.parent === 0) {
            if (cate.slug === 'clothing') {
              cate.icon = 'shirt';
            } else if (cate.slug === 'music') {
              cate.icon = 'musical-notes';
            } else if (cate.slug === 'posters') {
              cate.icon = 'images';
            }
            this.categories.push(cate);
          }
        });
      }, err => {
        console.log(err);
      })
  }

  ionViewDidEnter() {
    this.storage.ready()
      .then(() => {
        this.storage.get('userLoginInfo')
          .then(data => {
            if (data) {
              console.log(data)
              this.user = data.user;
              this.loggedIn = true;
            } else {
              this.user = {};
              this.loggedIn = false;
            }
          })
      })

  }

  openCategoryPage(cate) {
    this.childNavCtrl.setRoot(ProductsByCategoryPage, { category: cate });
  }

  openPage(pageName) {
    if (pageName === 'signup') {
      this.navCtrl.push(SignUpPage);
    }

    if (pageName === 'login') {
      this.navCtrl.push(LoginPage)
    }
  }
}
