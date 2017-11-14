import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import * as WC from 'woocommerce-api';
/**
 * Generated class for the SignUpPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-sign-up',
  templateUrl: 'sign-up.html',
})
export class SignUpPage {
  newUser: any = {};
  WooCommerce: any;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private toastCtrl: ToastController) {
    this.newUser.billing_address = {};
    this.WooCommerce = WC({
      url: 'http://192.168.1.101:9000',
      consumerKey: 'ck_399e245a41820a43d8108b06d249cc16b4c2e416',
      consumerSecret: 'cs_e30d2a9f74899438b4022c6dd13a0a037f95f862'
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignUpPage');
  }

  checkEmail() {
    let validEmail = false;
    const reg = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const email = this.newUser.email;
    if (reg.test(email)) {
      this.WooCommerce.getAsync('customers/email/' + email)
        .then(data => {
          const res = JSON.parse(data.body);
          if (res.errors) {
            validEmail = true;
          } else {
            validEmail = false;
          }

          if (validEmail) {
            this.toastCtrl.create({
              message: 'Congratulations. Email is good to go.',
              duration: 3000
            }).present();
          } else {
            this.toastCtrl.create({
              message: 'Email already registered. Please check.',
              duration: 3000,
              showCloseButton: true
            }).present();
          }
        })
    } else {
      validEmail = false;
      this.toastCtrl.create({
        message: 'Invalid Email. Please check.',
        duration: 3000
      }).present();
    }
  }

  signup() {
    let customerData = {
      customer: {}
    };

    customerData.customer = this.newUser;
    this.WooCommerce.postAsync('customers', customerData)
      .then(data => {
        console.log(JSON.parse(data.body));
      })
  }
}
