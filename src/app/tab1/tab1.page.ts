import { Component, OnDestroy, OnInit } from '@angular/core';
import { AlertController, NavController, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { PriceService } from '../services/price.service';
import { AuthService } from '../services/auth.service';
import { WalletService } from '../services/wallet.service';
import { Coin } from '../types/coin';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit, OnDestroy {
  coins: Coin[] = [];
  filteredCoins: Coin[] = [];
  loading = false;
  searchTerm = '';
  lastUpdated?: Date;

  private marketSub?: Subscription;

  constructor(
    private priceService: PriceService,
    private walletService: WalletService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private navCtrl: NavController,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.marketSub = this.priceService.market$.subscribe(list => {
      this.coins = list;
      this.applyFilter();
      this.lastUpdated = new Date();
    });
    this.loadMarket();
  }

  ngOnDestroy(): void {
    this.marketSub?.unsubscribe();
  }

  loadMarket(event?: any): void {
    this.loading = true;
    this.priceService.fetchMarket().subscribe({
      next: () => {
        this.loading = false;
        event?.target?.complete();
      },
      error: () => {
        this.loading = false;
        event?.target?.complete();
        this.presentToast('Não foi possível atualizar os preços agora.', 'danger');
      }
    });
  }

  applyFilter(): void {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) {
      this.filteredCoins = this.coins;
      return;
    }
    this.filteredCoins = this.coins.filter(
      coin =>
        coin.name.toLowerCase().includes(term) ||
        coin.symbol.toLowerCase().includes(term)
    );
  }

  async addToWallet(coin: Coin): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: `Adicionar ${coin.symbol.toUpperCase()}`,
      message: 'Informe a quantidade que já possui.',
      inputs: [
        {
          name: 'amount',
          type: 'number',
          placeholder: 'Ex: 0.05',
          attributes: {
            min: 0,
            step: '0.0001'
          }
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Salvar',
          handler: data => {
            const amount = parseFloat(data.amount);
            if (isNaN(amount) || amount <= 0) {
              this.presentToast('Digite uma quantidade válida.', 'warning');
              return false;
            }
            this.walletService.addCoin(coin, amount);
            this.presentToast(`${coin.name} adicionada à sua carteira.`, 'success');
            return true;
          }
        }
      ]
    });
    await alert.present();
  }

  openDetails(coin: Coin): void {
    this.navCtrl.navigateForward(`/tabs/detail/${coin.id}`);
  }

  trackById(_index: number, item: Coin): string {
    return item.id;
  }

  heroBarValue(): number {
    const pct = this.coins[0]?.price_change_percentage_24h ?? 0;
    if (pct <= 0) return 0;
    return Math.min(Math.max(pct / 20, 0), 1);
  }

  logout(): void {
    this.authService.logout();
    this.navCtrl.navigateRoot('/login');
  }

  private async presentToast(message: string, color: 'success' | 'warning' | 'danger'): Promise<void> {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2800,
      position: 'bottom',
      color
    });
    toast.present();
  }
}
