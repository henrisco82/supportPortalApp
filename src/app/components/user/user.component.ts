import { HttpErrorResponse, HttpEvent, HttpEventType } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { faEdit, faPlus, faSync, faTrash, faEnvelope, faShieldAlt, faIdBadge, faSignInAlt, faLock, faUnlock, faCogs, faUsers, faUser, faCamera, faTimes } from '@fortawesome/free-solid-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { NotificationType } from 'src/app/enum/notification-type.enum';
import { Role } from 'src/app/enum/role.enum';
import { CustomHttpResponse } from 'src/app/model/custom-http-response';
import { FileUploadStatus } from 'src/app/model/file-upload.status';
import { User } from 'src/app/model/user';
import { AuthService } from 'src/app/service/auth.service';
import { NotificationService } from 'src/app/service/notification.service';
import { UserService } from 'src/app/service/user.service';


@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit, OnDestroy {

  faEdit = faEdit as IconProp;
  faTrash = faTrash as IconProp;
  faPlus = faPlus as IconProp;
  faSync = faSync as IconProp;
  faEnvelope = faEnvelope as IconProp;
  faShieldAlt = faShieldAlt as IconProp;
  faIdBadge = faIdBadge as IconProp;
  faSignInAlt = faSignInAlt as IconProp;
  faLock = faLock as IconProp;
  faUnlock = faUnlock as IconProp;
  faCogs = faCogs as IconProp;
  faUsers = faUsers as IconProp;
  faUser = faUser as IconProp;
  faCamera = faCamera as IconProp;
  faTimes = faTimes as IconProp;



  private titleSubject = new BehaviorSubject<string>('Users');
  public titleAction$ = this.titleSubject.asObservable();
  public users: User[] = [];
  public user: User;
  public refreshing: boolean = false;
  private subscriptions: Subscription[] = [];
  public selectedUser: User;
  public selectedUserToDelete: User | undefined = undefined;
  public fileName: string | null = "";
  public profileImage: any;
  public editUser: User = new User();
  private currentUsername: string = "";
  public fileStatus: FileUploadStatus = new FileUploadStatus();
  isLoggedIn: boolean;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router,
    private notifier: NotificationService){
      this.selectedUser = new User();
      this.user = new User();
      this.isLoggedIn = false;
    }

  ngOnInit(): void {
    this.getUsers(true);
    this.user = this.authService.getUserFromLocalCache();
    this.isLoggedIn = this.authService.isUserLoggedIn();
  }

  logout(){
    this.authService.logout();
    this.router.navigate(["/login"]);
    this.isLoggedIn = false;
  }

  public changeTitle(title: string): void {
    this.titleSubject.next(title);
  }

  public getUsers(showNotification: boolean): void {
    this.refreshing = true;
    this.subscriptions.push(
      this.userService.getUsers().subscribe(
        (response: User[]) => {
          this.userService.addUsersToLocalCache(response);
          this.users = response;
          this.refreshing = false;
          if(showNotification){
            this.sendNotification(NotificationType.SUCCESS, `${response.length} user(s) loaded successfully`);``
          }
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, `${errorResponse.error.message}`);
          this.refreshing = false;
        }
      )
    );
  }

  public updateProfileImage(): void {
    this.clickButton('profile-image-input');
  }

  public onUpdateProfileImage(): void {
    const formData = new FormData();
    formData.append('username', this.user.username);
    formData.append('profileImage', this.profileImage)
    this.subscriptions.push(this.userService.updateProfileImage(formData).subscribe(
      (event: HttpEvent<any>) => {
        this.reportUploadProgress(event);
      },(errorResponse: HttpErrorResponse) => {
        this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
        this.fileStatus.status = 'done';
      }
    ));
  }

  private reportUploadProgress(event: HttpEvent<any>) {
    switch(event.type){
      case HttpEventType.UploadProgress:
        if (event.total) this.fileStatus.percentage = Math.round(100 * event.loaded / event.total);
        this.fileStatus.status = "progress";
        break;
      case HttpEventType.Response:
        if (event.status === 200){
            this.user.profileImageUrl = `${event.body.profileImageUrl}?time=${new Date().getTime()}`;
            this.sendNotification(NotificationType.SUCCESS, `profile image updated successfully`);
            this.fileStatus.status = 'done';
            break;
        }else{
          this.sendNotification(NotificationType.ERROR, "unable to upload, please try again");
          break;
        }
      default:
        "finished all processes";


    }
  }

  public onSelectUser(selectedUser: User): void{
    this.selectedUser = selectedUser;
    this.clickButton('openUserInfo');
  }

  public onEditUser(editUser: User): void {
    this.editUser = editUser;
    this.currentUsername = editUser.username;
    this.clickButton('openUserEdit');
  }

  public onProfileImageChange(event: any): void{
    this.fileName = event.files[0].name;
    this.profileImage = event.files[0];
  }

  public saveNewUser(): void{
    this.clickButton('new-user-save');
  }

  public onAddNewUser(userForm: NgForm): void{
    const formData = this.userService.CreateUserFormData(null, userForm.value, this.profileImage);
    this.subscriptions.push(this.userService.addUser(formData).subscribe(
      (response: User) => {
        this.clickButton('new-user-close');
        // Add new user to local array immediately for better UX
        this.users.unshift(response);
        this.userService.addUsersToLocalCache(this.users);
        this.getUsers(false);
        this.fileName = null;
        this.profileImage = null;
        userForm.reset();
        this.sendNotification(NotificationType.SUCCESS, `${response.firstName} ${response.lastName} added successfully`);
      },(errorResponse: HttpErrorResponse) => {
        this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
        this.profileImage = null;
      }
    ));
  }

  public onUpdateUser(): void {
    const formData = this.userService.CreateUserFormData(this.currentUsername, this.editUser, this.profileImage);
    this.subscriptions.push(this.userService.updateUser(formData).subscribe(
      (response: User) => {
        this.clickButton('edit-user-close');
        // Update user in local array immediately for better UX
        const index = this.users.findIndex(user => user.username === this.currentUsername);
        if (index !== -1) {
          this.users[index] = response;
          this.userService.addUsersToLocalCache(this.users);
        }
        this.getUsers(false);
        this.fileName = null;
        this.profileImage = null;
        this.sendNotification(NotificationType.SUCCESS, `${response.firstName} ${response.lastName} updated successfully`);
      },(errorResponse: HttpErrorResponse) => {
        this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
        this.profileImage = null;
      }
    ));
  }

  public onUpdateCurrentUser(user: User): void {
    this.refreshing = true;
    this.currentUsername = this.authService.getUserFromLocalCache().username;
    const formData = this.userService.CreateUserFormData(this.currentUsername, this.user, this.profileImage);
    this.subscriptions.push(this.userService.updateUser(formData).subscribe(
      (response: User) => {
        this.authService.addUserToLocalCache(user);
        this.getUsers(false);
        this.fileName = null;
        this.profileImage = null;
        this.sendNotification(NotificationType.SUCCESS, `${response.firstName} ${response.lastName} updated successfully`);
      },(errorResponse: HttpErrorResponse) => {
        this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
        this.refreshing = false;
        this.profileImage = null;
      }
    ));
  }

  public searchUsers(searchTerm: string): void {
    const results: User[] = [];
    const users = this.userService.getUsersFromLocalCache() || [];
    for(const user of users){
      if(user.firstName.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1 ||
         user.lastName.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1 ||
         user.username.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1 ||
         user.userId.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1
      ){
        results.push(user);
      }
    }
    this.users = results;
    if(results.length == 0 || !searchTerm){
      this.users = users;
    }
  }

  public onDeleteUser(username: string): void{
    // Find the user to check their role
    const userToDelete = this.users.find(user => user.username === username);

    if (userToDelete && userToDelete.role === Role.SUPER_ADMIN) {
      this.sendNotification(NotificationType.ERROR, 'Super Admin cannot be deleted. This action is not allowed.');
      return;
    }

    // Store the user for modal display and set up for deletion
    this.selectedUserToDelete = userToDelete;

    // Show the Bootstrap modal
    const modalElement = document.getElementById('deleteUserModal');
    if (modalElement) {
      const modal = new (window as any).bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  public confirmDeleteUser(): void {
    if (!this.selectedUserToDelete) return;

    const username = this.selectedUserToDelete.username;

    this.subscriptions.push(
      this.userService.deleteUser(username).subscribe(
        (response: CustomHttpResponse) => {
          // Remove user from local array immediately for better UX
          this.users = this.users.filter(user => user.username !== username);
          // Update local cache
          this.userService.addUsersToLocalCache(this.users);
          // Show success message
          this.sendNotification(NotificationType.SUCCESS, response?.message || 'User deleted successfully');
          // Refresh from server to ensure consistency
          this.getUsers(false);
          this.selectedUserToDelete = undefined; // Clear selection
        },(errorResponse: HttpErrorResponse) => {
          // Handle 404 and other errors gracefully
          if(errorResponse.status === 404) {
            // Check if this might be a Super Admin deletion attempt
            const userToDelete = this.users.find(user => user.username === username);
            if (userToDelete && userToDelete.role === Role.SUPER_ADMIN) {
              this.sendNotification(NotificationType.ERROR, 'Super Admin cannot be deleted. This action is not allowed.');
            } else {
              this.sendNotification(NotificationType.ERROR, 'User not found or already deleted');
            }
          } else {
            this.sendNotification(NotificationType.ERROR, errorResponse.error?.message || 'Failed to delete user');
          }
          // Refresh the list to ensure consistency
          this.getUsers(false);
          this.selectedUserToDelete = undefined; // Clear selection
        }
      )
    )
  }

  public onResetPassword(emailForm: NgForm): void {
    this.refreshing = true;
    const emailAddress = emailForm.value['reset-password-email'];
    this.subscriptions.push(
      this.userService.resetPassword(emailAddress).subscribe(
        (response: CustomHttpResponse) => {
          this.sendNotification(NotificationType.SUCCESS, response.message);
          this.refreshing = false;
        },(errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationType.WARNING, errorResponse.error.message);
          this.refreshing = false;
        },() => {
          emailForm.reset();
        }
      )
    )
  }


  public get isAdmin(): boolean {
    return this.getUserRole() === Role.ADMIN || this.getUserRole() === Role.SUPER_ADMIN;
  }

  public get isManager(): boolean {
    return this.isAdmin  || this.getUserRole() === Role.MANAGER;
  }

  public get isAdminOrManager(): boolean {
    return this.isAdmin || this.isManager;
  }

  private getUserRole(): string {
    return this.authService.getUserFromLocalCache().role;
  }


  private sendNotification(notificationType: NotificationType, message: string): void {
    if (message) {
      this.notifier.notify(notificationType, message);
    }else {
      this.notifier.notify(notificationType, "An error occurred, Try again");
    }
  }


  private clickButton(buttonId: string): void{
    document.getElementById(buttonId)?.click();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

}
