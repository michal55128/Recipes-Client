import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { User } from '../models/user';
import { Observable } from 'rxjs';

export interface SignResponse {
  user: User;
  token: string;
} 

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);
  private usersURL = `${environment.apiURL}/users`;
  currentUser?: User;
  user: User = {};

  setUserDetails(userDetails: User) {
    this.user = userDetails;
  }
  getUserDetails() {
    return this.user;
  }
  public get token(): string | null {
    return localStorage.getItem('Token');
  }
  public set token(token: string | null) {
    if (token) {
      localStorage.setItem('Token',token);
    }
  }
  login(u: User) {
    return this.http.post<{ user: User; token: string }>(
      `${this.usersURL}/signIn`,
      u
    );
  }
  register(u: User) : Observable<HttpResponse<SignResponse>>{
    return this.http.post<SignResponse>(this.usersURL + "/signUp", u, { observe: 'response' });
  }
  getAllUsers(){
    return this.http.get(`${this.usersURL}/`)

  }



}
