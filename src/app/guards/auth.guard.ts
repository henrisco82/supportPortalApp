import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { NotificationType } from '../enum/notification-type.enum';
import { AuthService } from '../service/auth.service';
import { NotificationService } from '../service/notification.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService
    ){

  }

  canActivate(route: ActivatedRouteSnapshot,state: RouterStateSnapshot):  boolean  {
    return this.isUserLoggedIn();
  }

  private isUserLoggedIn(): boolean {
    if(this.authService.isUserLoggedIn()){
      return true;
    }
    this.router.navigate(['/login']);
    this.notificationService.notify(NotificationType.ERROR, `You need to log in to access this page`.toUpperCase());
    return false;
  }

}
