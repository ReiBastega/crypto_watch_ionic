import { Component, OnDestroy, OnInit } from '@angular/core';
import { AlertController, NavController, ToastController } from '@ionic/angular';
import { combineLatest, Subscription } from 'rxjs';
import { PriceService } from '../services/price.service';
import { WalletService } from '../services/wallet.service';
import { Coin, WalletEntry } from '../types/coin';

type WalletPosition = WalletEntry & {
  currentPrice: number;
  change24h: number;
  total: number;
};

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit, OnDestroy {
  positions: WalletPosition[] = [];
  total = 0;
  avgChange = 0;
  private sub?: Subscription;

  constructor(
    private walletService: WalletService,
    private priceService: PriceService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private navCtrl: NavController
  ) {}

  ngOnInit(): void {
    this.bindPortfolio();
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  bindPortfolio(): void {
    this.sub = combineLatest([this.walletService.wallet$, this.priceService.market$]).subscribe(
      ([wallet, market]) => {
        this.positions = wallet.map(entry => this.toPosition(entry, market));
        this.total = this.positions.reduce((acc, cur) => acc + cur.total, 0);
        this.avgChange = this.positions.length
          ? this.positions.reduce((sum, p) => sum + p.change24h, 0) / this.positions.length
          : 0;
      }
    );
  }

  refresh(event?: any): void {
    this.priceService.fetchMarket().subscribe({
      next: () => event?.target?.complete(),
      error: () => {
        event?.target?.complete();
        this.presentToast('Falha ao atualizar preços agora.', 'danger');
      }
    });
  }

  async editAmount(position: WalletPosition): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: `Editar ${position.symbol.toUpperCase()}`,
      inputs: [
        {
          name: 'amount',
          type: 'number',
          value: position.quantity,
          attributes: {
            min: 0,
            step: '0.0001'
          }
        }
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Salvar',
          handler: data => {
            const amount = parseFloat(data.amount);
            if (isNaN(amount) || amount < 0) {
              this.presentToast('Quantidade inválida.', 'warning');
              return false;
            }
            this.walletService.updateAmount(position.coinId, amount);
            this.presentToast('Quantidade atualizada.', 'success');
            return true;
          }
        }
      ]
    });
    await alert.present();
  }

  async remove(position: WalletPosition): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: `Remover ${position.name}?`,
      message: 'Essa moeda sairá da sua carteira.',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Remover',
          role: 'destructive',
          handler: () => {
            this.walletService.removeCoin(position.coinId);
            this.presentToast(`${position.name} removida.`, 'danger');
          }
        }
      ]
    });
    await alert.present();
  }

  openDetails(position: WalletPosition): void {
    this.navCtrl.navigateForward(`/tabs/detail/${position.coinId}`);
  }

  allocation(position: WalletPosition): number {
    if (!this.total) return 0;
    return position.total / this.total;
  }

  trackByCoin(_index: number, item: WalletPosition): string {
    return item.coinId;
  }

  private toPosition(entry: WalletEntry, market: Coin[]): WalletPosition {
    const live = market.find(m => m.id === entry.coinId);
    const currentPrice = live?.current_price ?? entry.lastPrice ?? 0;
    const change24h = live?.price_change_percentage_24h ?? 0;
    const total = currentPrice * entry.quantity;
    return { ...entry, currentPrice, change24h, total };
  }

  private async presentToast(message: string, color: 'success' | 'warning' | 'danger'): Promise<void> {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2600,
      position: 'bottom',
      color
    });
    toast.present();
  }
}
