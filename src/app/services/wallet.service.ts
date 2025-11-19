import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { WalletEntry, Coin } from '../types/coin';

@Injectable({ providedIn: 'root' })
export class WalletService {
  private readonly storageKey = 'crypto_wallet';
  private walletSubject = new BehaviorSubject<WalletEntry[]>(this.loadFromStorage());
  readonly wallet$ = this.walletSubject.asObservable();

  addCoin(coin: Coin, quantity: number): void {
    const existing = this.walletSubject.value.find(entry => entry.coinId === coin.id);
    let next: WalletEntry[];
    if (existing) {
      next = this.walletSubject.value.map(entry =>
        entry.coinId === coin.id
          ? { ...entry, quantity: entry.quantity + quantity, lastPrice: coin.current_price }
          : entry
      );
    } else {
      next = [
        ...this.walletSubject.value,
        {
          coinId: coin.id,
          name: coin.name,
          symbol: coin.symbol,
          image: coin.image,
          quantity,
          lastPrice: coin.current_price
        }
      ];
    }
    this.persist(next);
  }

  updateAmount(coinId: string, quantity: number): void {
    const next = this.walletSubject.value.map(entry =>
      entry.coinId === coinId ? { ...entry, quantity } : entry
    );
    this.persist(next);
  }

  removeCoin(coinId: string): void {
    const next = this.walletSubject.value.filter(entry => entry.coinId !== coinId);
    this.persist(next);
  }

  getWallet(): Observable<WalletEntry[]> {
    return this.wallet$;
  }

  private persist(next: WalletEntry[]): void {
    this.walletSubject.next(next);
    localStorage.setItem(this.storageKey, JSON.stringify(next));
  }

  private loadFromStorage(): WalletEntry[] {
    try {
      const raw = localStorage.getItem(this.storageKey);
      return raw ? (JSON.parse(raw) as WalletEntry[]) : [];
    } catch (err) {
      return [];
    }
  }
}
