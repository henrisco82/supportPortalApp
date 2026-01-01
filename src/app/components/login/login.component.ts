import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { HeaderType } from 'src/app/enum/header-type.enum';
import { NotificationType } from 'src/app/enum/notification-type.enum';
import { User } from 'src/app/model/user';
import { AuthService } from 'src/app/service/auth.service';
import { NotificationService } from 'src/app/service/notification.service';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  public showLoading: boolean = false;
  private subscriptions: Subscription[] = [];
  public faSpinner = faSpinner as IconProp;



  constructor(
    private router: Router,
    private authService: AuthService,
    private notifier: NotificationService
  ) { }


  ngOnInit(): void {
    if(this.authService.isUserLoggedIn()){
      this.router.navigateByUrl('/user/management');
    }else{
      this.router.navigateByUrl('/login');
    }
  }

  public onLogin(loginForm: any): void {
    this.showLoading = true;
    console.log(loginForm);
    // Create a User object with just username and password
    const user = new User();
    user.username = loginForm.username;
    user.password = loginForm.password;

    this.subscriptions.push(
      this.authService.login(user).subscribe(
        (response: HttpResponse<User>) => {
          console.log('Login successful!');
          let token = ""; // Declare token variable first

          // Find JWT token in any header that contains jwt/token/auth
          response.headers.keys().forEach(key => {
            if (key.toLowerCase().includes('jwt') || key.toLowerCase().includes('token') || key.toLowerCase().includes('auth')) {
              token = response.headers.get(key) || "";
              console.log(`Found token in header '${key}':`, token.substring(0, 50) + '...');
            }
          });

          console.log('Final token found:', token);

          console.log('Final token to save:', token);
          this.authService.saveToken(token);
          console.log('Token saved to localStorage:', localStorage.getItem('token'));
          this.authService.addUserToLocalCache(response.body as User);
          console.log('User cached:', response.body);
          console.log('Is user logged in?', this.authService.isUserLoggedIn());
          this.router.navigateByUrl('/user/management');
          this.showLoading = false;
        }, (errorResponse: HttpErrorResponse) => {
          this.sendErrorNotification(NotificationType.ERROR, errorResponse.error.message);
          this.showLoading = false;
        }
      )
    );
  }

  private sendErrorNotification(notificationType: NotificationType, message: string): void {
    if (message) {
      this.notifier.notify(notificationType, message);
    }else {
      this.notifier.notify(notificationType, "An error occurred, Try again");
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

}
