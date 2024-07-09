import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { User } from '../models/user';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { log } from 'console';
import { Recipe } from '../models/recipe';
import { Router } from '@angular/router';

export interface SignResponse {
  user: User;
  token: string;
}
@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);
  private router=inject(Router);
  private usersURL = `${environment.apiURL}/users`;
  currentUser?: User;
  user: User = {};

  setUserDetails(userDetails: User) {
    this.user = userDetails;
  }
  getUserDetails() {
    return this.user;
  }

  public logout() {
    localStorage.removeItem('CurrentUser');
    localStorage.removeItem('usertoken');
    localStorage.removeItem('time');
    this.router.navigate(['/']);

  }
  public set loginUser(user: string | null) {
    if (user) {
      const userData: User = JSON.parse(user);
      this.currentUser = userData;
      localStorage.setItem('CurrentUser', user);
      // localStorage.setItem('usertoken', token); 
      // localStorage.setItem('time', Date.now().toString());

    }
  }
  // public get getCurrentUser(): string | null {
  //   return localStorage.getItem('CurrentUser');
  // }
  getCurrentUser(): User | null {
    const userData = localStorage.getItem('CurrentUser');
    return userData ? JSON.parse(userData) : null;
  }

  login(u: User) {
    console.log(this.currentUser);
    return this.http.post<{ user: User; token: string }>(
      `${this.usersURL}/signIn`,
      u
    );
  }
  register(u: User): Observable<HttpResponse<SignResponse>> {
    if (u) this.loginUser = JSON.stringify(u);
    this.currentUser = u;
    return this.http.post<SignResponse>(this.usersURL + '/signUp', u, {
      observe: 'response',
    });
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.usersURL).pipe(
      catchError((error) => {
        console.error('An error occurred:', error);
        return of([]);
      })
    );
  }


  public get token(): string | null | boolean {
    const incomeTimeStr = localStorage.getItem('time');
    if (!incomeTimeStr) {
      return false;
    }
    const tokenTime = parseInt(incomeTimeStr, 10);
    const now = Date.now();
  
    const diffInMinutes = (now - tokenTime) / (1000 * 60); 
    if (diffInMinutes < 60) { 
      return localStorage.getItem('usertoken');
    }
    return false;
  }
  
  public set token(token: string | null | undefined) {
    if (token) {
      localStorage.setItem('usertoken', token); 
      localStorage.setItem('time', Date.now().toString());
    }
  }
  



}
