import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NotificationType } from '../enum/notification-type.enum';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private toastr: ToastrService) { }

  public notify(type: NotificationType, message: string): void {
    switch (type) {
      case NotificationType.SUCCESS:
        this.toastr.success(message);
        break;
      case NotificationType.ERROR:
        this.toastr.error(message);
        break;
      case NotificationType.WARNING:
        this.toastr.warning(message);
        break;
      case NotificationType.INFO:
        this.toastr.info(message);
        break;
      default:
        this.toastr.show(message);
    }
  }
}
