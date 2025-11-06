import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanLoad,
  Route,
  Router,
  RouterStateSnapshot,
  UrlSegment,
  UrlTree
} from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate, CanLoad {
  constructor(private auth: AuthService, private router: Router) {}

  private handleAuth(): boolean | UrlTree {
    if (this.auth.isAuthenticated) {
      return true;
    }
    return this.router.parseUrl('/login');
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree {
    return this.handleAuth();
  }

  canLoad(route: Route, segments: UrlSegment[]): boolean | UrlTree {
    return this.handleAuth();
  }
}

