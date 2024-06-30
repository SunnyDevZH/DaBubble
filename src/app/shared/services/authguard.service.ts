import { Injectable, inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  CanActivateFn,
} from '@angular/router';
import { AuthService } from './auth.service';

export
@Injectable({
  providedIn: 'root',
})
class AuthGuardService {
  authService = inject(AuthService);
  
  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {    
      
    if (this.authService.activeUserAccount) {
      return true;
    } else {
      this.router.navigateByUrl('/login');
      return false;
    }
  }
}
export const IsAdminGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): boolean => {
  return inject(AuthGuardService).canActivate(route, state);
};
