import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { Subscription } from 'rxjs';
import { NotificationType } from 'src/app/enum/notification-type.enum';
import { User } from 'src/app/model/user';
import { AuthService } from 'src/app/service/auth.service';
import { NotificationService } from 'src/app/service/notification.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit, OnDestroy {

  public showLoading: boolean = false;
  private subscriptions: Subscription[] = [];
  public faSpinner = faSpinner as IconProp;


  constructor(
    private router: Router,
    private authService: AuthService,
    private notifier: NotificationService
  ) {

   }

   ngOnInit(): void {
    if(this.authService.isUserLoggedIn()){
      this.router.navigateByUrl('/user/management');
    }
  }

  public onRegister(registerForm: any): void {
    this.showLoading = true;
    console.log(registerForm);
    // Create a User object with the form data
    const user = new User();
    user.firstName = registerForm.firstName;
    user.lastName = registerForm.lastName;
    user.username = registerForm.username;
    user.email = registerForm.email;

    this.subscriptions.push(
      this.authService.register(user).subscribe(
        (response: User) => {
          this.showLoading = false;
          this.sendNotification(NotificationType.SUCCESS, `A new account was created for ${response.firstName}. Please check your email to login`);
          this.router.navigateByUrl('/login');
        }, (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
          this.showLoading = false;
        }
      )
    );
  }

  private sendNotification(notificationType: NotificationType, message: string): void {
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
