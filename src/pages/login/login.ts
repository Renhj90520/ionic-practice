import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { SignUpPage } from '../sign-up/sign-up';
import { Http } from '@angular/http';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  userName: string;
  password: string;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private http: Http) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  login() {
    this.http.get('http://192.168.1.101:9000/api/auth/generate_auth_cookie/?insecure=cool&username=' + this.userName + '&password=' + this.password)
      .subscribe(res => {
        console.log(res.json());
      })
  }

  signup() {
    this.navCtrl.push(SignUpPage);
  }
}
