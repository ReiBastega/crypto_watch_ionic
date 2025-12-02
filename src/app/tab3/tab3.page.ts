import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';
import { combineLatest, Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { PriceService } from '../services/price.service';
import { WalletService } from '../services/wallet.service';
import { Coin, WalletEntry } from '../types/coin';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit, OnDestroy {
  topGainers: Coin[] = [];
  topLosers: Coin[] = [];
  topVolume: Coin[] = [];
  topMarketCap: Coin[] = [];
  topVolatile: Coin[] = [];
  top7d: Coin[] = [];
  top30d: Coin[] = [];
  nearAth: Coin[] = [];
  walletTotal = 0;
  walletCoins: WalletEntry[] = [];
  private sub?: Subscription;

  constructor(
    private priceService: PriceService,
    private walletService: WalletService,
    private navCtrl: NavController,
    private toastCtrl: ToastController,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.sub = combineLatest([this.priceService.market$, this.walletService.wallet$]).subscribe(
      ([market, wallet]) => {
        this.topGainers = [...market].sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h).slice(0, 4);
        this.topLosers = [...market].sort((a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h).slice(0, 4);
        this.topVolume = [...market].sort((a, b) => (b.total_volume ?? 0) - (a.total_volume ?? 0)).slice(0, 4);
        this.topMarketCap = [...market].sort((a, b) => (b.market_cap ?? 0) - (a.market_cap ?? 0)).slice(0, 4);
        this.topVolatile = [...market]
          .sort((a, b) => Math.abs(b.price_change_percentage_24h) - Math.abs(a.price_change_percentage_24h))
          .slice(0, 4);
        this.top7d = [...market]
          .filter(c => c.price_change_percentage_7d_in_currency !== undefined)
          .sort((a, b) => (b.price_change_percentage_7d_in_currency ?? 0) - (a.price_change_percentage_7d_in_currency ?? 0))
          .slice(0, 4);
        this.top30d = [...market]
          .filter(c => c.price_change_percentage_30d_in_currency !== undefined)
          .sort(
            (a, b) => (b.price_change_percentage_30d_in_currency ?? 0) - (a.price_change_percentage_30d_in_currency ?? 0)
          )
          .slice(0, 4);
        this.nearAth = [...market]
          .filter(c => c.ath_change_percentage !== undefined)
          .sort((a, b) => Math.abs(a.ath_change_percentage ?? 0) - Math.abs(b.ath_change_percentage ?? 0))
          .slice(0, 4);
        this.walletCoins = wallet;
        this.walletTotal = wallet.reduce((acc, entry) => {
          const marketCoin = market.find(c => c.id === entry.coinId);
          const price = marketCoin?.current_price ?? entry.lastPrice ?? 0;
          return acc + price * entry.quantity;
        }, 0);
      }
    );
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  refresh(event?: any): void {
    this.priceService.fetchMarket().subscribe({
      next: () => event?.target?.complete(),
      error: () => {
        event?.target?.complete();
        this.presentToast('Não conseguimos atualizar agora.', 'danger');
      }
    });
  }

  openDetails(coin: Coin): void {
    this.navCtrl.navigateForward(`/tabs/detail/${coin.id}`);
  }

  trackById(_index: number, item: Coin): string {
    return item.id;
  }

  logout(): void {
    this.authService.logout();
    this.navCtrl.navigateRoot('/login');
  }

  private async presentToast(message: string, color: 'success' | 'warning' | 'danger'): Promise<void> {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2400,
      position: 'bottom',
      color
    });
    toast.present();
  }
}
