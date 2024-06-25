import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';

import { MatIconModule } from '@angular/material/icon';
import { LoginComponent } from './components/login/login.component';
import { UserService } from './shared/services/user.service';
import { MatCardModule } from '@angular/material/card';
import { User } from './shared/models/user';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule, MatIconModule, MatCardModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'recipes';
  userService = inject(UserService);
  isManager = false;
  currentUser: User = {};
  isConected = false;
  constructor(private router: Router) {}
  ngOnInit() {
    {
      let currntUser: User | null = this.userService.getCurrentUser();
      if (currntUser) {
        // this.currentUser = JSON.parse(currntUser);
        console.log('currentUser' + this.currentUser);
        this.isManager = this.currentUser.role == 'admin';
        this.isConected = true;
      } else {
        console.error('No current user found');
      }

      console.log(this.isConected);
      console.log(this.isManager);

      if (!this.currentUser) {
        return 'person_outline';
      } else if (this.currentUser.role === 'admin') {
        return 'verified_user';
      } else {
        return 'person';
      }
    }
  }

  // getUserIcon(): string {
  //   if (!this.currentUser) {
  //     return 'person_outline';
  //   } else if (this.currentUser.role === 'admin') {
  //     return 'verified_user';
  //   } else {
  //     return 'person';
  //   }
  // }

  getUserIcon(): string {
    const user = this.currentUser;
    if (user.role === 'user') {
      return 'person';
    } else if (user.role === 'admin') {
      return 'admin_panel_settings';
    } else {
      return 'person_outline';
    }
  }

  logout() {   
     this.router.navigate(["/"]);

    this.userService.logout();
    this.isConected = !this.isConected;
  }
 
  login() {
    this.isConected = !this.isConected;
  }

  showProfile: boolean = false;
  showLogin: boolean = true;
  toggleProfile() {
    this.showProfile = !this.showProfile;
  }
  showLoginUser() {
    this.showLogin=!this.showLogin;
  }
  getUser() {
    return this.currentUser;
  }
  loginUser() {
    this.router.navigate(['login']);
    this.showLogin=false;
  }
  registerUser() {
    this.router.navigate(['register']);
    this.showLogin=false;

  }
  logOut() {
    this.userService.logout();
    this.currentUser = {};
    this.isConected = !this.isConected;
    this.showProfile = false;
    this.showLogin=true;
  }
}
