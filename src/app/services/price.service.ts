import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, timer } from 'rxjs';
import { catchError, map, shareReplay, switchMap, tap } from 'rxjs/operators';
import { Coin } from '../types/coin';

@Injectable({ providedIn: 'root' })
export class PriceService {
  private readonly apiUrl = 'https://api.coingecko.com/api/v3/coins/markets';
  private readonly defaultParams = new HttpParams()
    .set('vs_currency', 'usd')
    .set('order', 'market_cap_desc')
    .set('per_page', '50')
    .set('page', '1')
    .set('sparkline', 'false')
    .set('price_change_percentage', '24h,7d,30d');

  private marketSubject = new BehaviorSubject<Coin[]>([]);
  readonly market$ = this.marketSubject.asObservable();

  constructor(private http: HttpClient) {
    timer(0, 45000)
      .pipe(
        switchMap(() =>
          this.fetchMarket().pipe(
            catchError(() => {
              return of(this.marketSubject.value);
            })
          )
        )
      )
      .subscribe();
  }

  fetchMarket(): Observable<Coin[]> {
    return this.http.get<Coin[]>(this.apiUrl, { params: this.defaultParams }).pipe(
      tap(coins => this.marketSubject.next(coins)),
      shareReplay(1)
    );
  }

  getCoinFromCache(id: string): Coin | undefined {
    return this.marketSubject.value.find(c => c.id === id);
  }

  getCoinDetails(id: string): Observable<Coin> {
    const cached = this.getCoinFromCache(id);
    if (cached) {
      return of(cached);
    }
    const params = this.defaultParams.set('ids', id);
    return this.http
      .get<Coin[]>(this.apiUrl, { params })
      .pipe(map(result => result[0]), tap(coin => coin && this.upsertCache(coin)));
  }

  private upsertCache(coin: Coin | undefined): void {
    if (!coin) return;
    const list = this.marketSubject.value;
    const exists = list.findIndex(c => c.id === coin.id);
    if (exists >= 0) {
      list[exists] = { ...list[exists], ...coin };
    } else {
      list.unshift(coin);
    }
    this.marketSubject.next([...list]);
  }
}
