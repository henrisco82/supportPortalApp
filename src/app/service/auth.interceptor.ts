import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if(request.url.includes(`${this.authService.host}/user/login`)){
      return next.handle(request);
    }
    if(request.url.includes(`${this.authService.host}/user/register`)){
      return next.handle(request);
    }
    if(request.url.includes(`${this.authService.host}/user/resetpassword`)){
      return next.handle(request);
    }
    this.authService.loadToken();
    const token = this.authService.getToken();
    const req = request.clone({setHeaders: { Authorization: `Bearer ${token}`}});
    return next.handle(req);
  }
}
