import { NgModule } from "@angular/core";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ToastrModule } from "ngx-toastr";

@NgModule({
  imports: [
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      timeOut: 5000,
      positionClass: 'toast-bottom-left',
      preventDuplicates: false,
      closeButton: true,
      progressBar: true,
      enableHtml: false,
      newestOnTop: true,
      maxOpened: 4,
      autoDismiss: true,
      resetTimeoutOnDuplicate: false,
      disableTimeOut: false
    })
  ],
  exports: [ToastrModule]
})
export class NotificationModule { }
