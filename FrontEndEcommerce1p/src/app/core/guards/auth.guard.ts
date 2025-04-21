import { Injectable } from '@angular/core';
import { 
  CanActivate, 
  ActivatedRouteSnapshot, 
  RouterStateSnapshot, 
  Router, 
  UrlTree 
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/auth/login'], { 
        queryParams: { returnUrl: state.url }
      });
      return false;
    }

    // Check for required roles
    const requiredRoles = route.data['roles'] as Array<string>;
    if (requiredRoles && requiredRoles.length > 0) {
      const userRoles = this.authService.getUserRoles();
      const hasRequiredRole = requiredRoles.some(role => userRoles.includes(role));
      
      if (!hasRequiredRole) {
        this.router.navigate(['/']);
        return false;
      }
    }

    return true;
  }
}