import { HttpClient, HttpErrorResponse, HttpEvent, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
// import { environment } from 'src/environments';
import { CustomHttpResponse } from '../model/custom-http-response';
import { User } from '../model/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private host = 'http://localhost:8081';

  constructor(private http: HttpClient) { }

  public getUsers(): Observable<User[]>{
    return this.http.get<User[]>(`${this.host}/user/list`)
  }

  public getUserByUsername(username: string): Observable<User>{
    return this.http.get<User>(`${this.host}/user/find/${username}`);
  }

  public addUser(formData: FormData): Observable<User>{
    console.log(formData);
    return this.http.post<User>(`${this.host}/user/add`, formData)
  }

  public updateUser(formData: FormData): Observable<User>{
    return this.http.post<User>(`${this.host}/user/update`, formData)
  }

  public resetPassword(email: string): Observable<CustomHttpResponse>{
    return this.http.get<CustomHttpResponse>(`${this.host}/user/resetPassword/${email}`)
  }

  public updateProfileImage(formData: FormData): Observable<HttpEvent<User>>{
    return this.http.post<User>(`${this.host}/user/updateProfileImage`, formData, {reportProgress: true, observe: 'events'});
  }

  public deleteUser(username: string): Observable<CustomHttpResponse> {
    return this.http.delete<CustomHttpResponse>(`${this.host}/user/delete/${username}`);
  }

  public addUsersToLocalCache(users: User[]): void {
    localStorage.setItem('users', JSON.stringify(users));
  }

  public getUsersFromLocalCache(): User[] | null {
    if(localStorage.getItem('users')){
      return JSON.parse(localStorage.getItem('users') || "");
    }
    return null;
  }

  public CreateUserFormData( loggedInUsername: string | null, user: User, profileImage: File): FormData {
      const formData = new FormData();
      formData.append('currentUsername', loggedInUsername as string);
      formData.append('firstName', user.firstName);
      formData.append('lastName', user.lastName);
      formData.append('username', user.username);
      formData.append('email', user.email);
      formData.append('role', user.role);
      formData.append('profileImage', profileImage);
      formData.append('isActive', JSON.stringify(user.active))
      formData.append('isNonLocked', JSON.stringify(user.notLocked))
      return formData;
  }

}
