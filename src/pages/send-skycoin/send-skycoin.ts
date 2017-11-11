import { Component, OnInit } from '@angular/core';
import { WalletProvider } from '../../providers/wallet/wallet.provider';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalApiProvider } from '../../providers/local-api/local-api.provider';
import { NavController, ViewController } from 'ionic-angular';
import { SecureStorageProvider } from '../../providers/secure-storage/secure-storage';
import { WalletsPage } from '../wallets/wallets';

@Component({
  selector: 'page-send-skycoin',
  templateUrl: 'send-skycoin.html',
})
export class SendSkycoinPage implements OnInit {

  form: FormGroup;
  loading = false;
  seedRequired: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private localApi: LocalApiProvider,
    private nav: NavController,
    private secureStorage: SecureStorageProvider,
    private view: ViewController,
    private wallet: WalletProvider,
  ) {
    if (this.secureStorage.secureStorageDisabled) {
      this.seedRequired = true;
    }
  }

  ngOnInit() {
    this.initForm();
  }

  cancel() {
    this.view.dismiss()
  }

  send() {
    this.loading = true;
    const seed = this.seedRequired ? this.form.value.seed : this.form.value.wallet.seed;
    const addresses = this.form.value.wallet.visible;
    const amount = this.form.value.amount * 1000000;
    this.localApi.postTransaction(seed, addresses, this.form.value.address, amount)
      .subscribe(
        () => setTimeout(() => this.returnAndRefresh(), 3000),
        error => console.log(error)
      );
  }

  private initForm() {
    const group: any = {
      wallet: ['', Validators.required],
      address: ['24pexN7n4uwgktCG4FrohgADbesTV3yTt5x', Validators.required],
      amount: ['', Validators.required],
    };

    if (this.seedRequired) {
      group.seed = ['', Validators.required];
    }

    this.form = this.formBuilder.group(group);
  }

  private returnAndRefresh() {
    this.loading = false;
    this.nav.setRoot(WalletsPage);
    setTimeout(() => this.wallet.refreshBalances(), 5000)
  }
}
