import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController, NavController, ToastController } from '@ionic/angular';
import { PriceService } from '../services/price.service';
import { WalletService } from '../services/wallet.service';
import { AuthService } from '../services/auth.service';
import { Coin } from '../types/coin';

@Component({
  selector: 'app-coin-detail',
  templateUrl: './coin-detail.page.html',
  styleUrls: ['./coin-detail.page.scss']
})
export class CoinDetailPage implements OnInit {
  coin?: Coin;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private priceService: PriceService,
    private walletService: WalletService,
    private navCtrl: NavController,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadCoin(id);
    }
  }

  loadCoin(id: string): void {
    this.loading = true;
    this.priceService.getCoinDetails(id).subscribe({
      next: coin => {
        if (!coin) {
          throw new Error('Coin not found');
        }
        this.coin = coin;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.presentToast('Não foi possível carregar essa moeda.', 'danger');
        this.navCtrl.back();
      }
    });
  }

  async addToWallet(): Promise<void> {
    if (!this.coin) return;
    const alert = await this.alertCtrl.create({
      header: `Adicionar ${this.coin.symbol.toUpperCase()}`,
      message: 'Qual quantidade você possui?',
      inputs: [
        {
          name: 'amount',
          type: 'number',
          attributes: { min: 0, step: '0.0001' }
        }
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Salvar',
          handler: data => {
            const amount = parseFloat(data.amount);
            if (isNaN(amount) || amount <= 0) {
              this.presentToast('Informe uma quantidade válida.', 'warning');
              return false;
            }
            this.walletService.addCoin(this.coin!, amount);
            this.presentToast('Moeda adicionada na carteira.', 'success');
            return true;
          }
        }
      ]
    });
    await alert.present();
  }

  priceColor(): string {
    if (!this.coin) {
      return '';
    }
    return this.coin.price_change_percentage_24h >= 0 ? 'positive' : 'negative';
  }

  logout(): void {
    this.authService.logout();
    this.navCtrl.navigateRoot('/login');
  }

  private async presentToast(message: string, color: 'success' | 'warning' | 'danger'): Promise<void> {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2500,
      position: 'bottom',
      color
    });
    toast.present();
  }
}
