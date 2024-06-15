import { Component, NgModule, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../shared/services/user.service';
import { User } from '../../shared/models/user';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ButtonModule, RouterModule, FormsModule, RouterOutlet],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private userService = inject(UserService);

  constructor(private router: Router) {}

  user: User = {
    password: '',
    email: '',
  };
  loginA() {
    const user: User = {
      email: this.user.email,
      password: this.user.password,
    };

    console.log(user);
    console.log(user.password);
    console.log(user.email);

    this.userService
      .login({ email: user.email, password: user.password })
      .subscribe(
        (data) => {
          console.log(data);
          this.userService.token = data.token;
          this.userService.loginUser = JSON.stringify(data.user);
          this.router.navigateByUrl('allrecipes');
        },
        (error) => {
          console.error('An error occurred while signing in:', error);
          this.userService.setUserDetails({
            email: user.email,
            password: user.password,
          });
          this.router.navigate(['register']);
        }
      );
  }

  register() {
    const user: User = {
      email: this.user.email,
      password: this.user.password,
    };
    console.log(this.user.password, this.user.email);

    this.userService.setUserDetails({
      email: user.email,
      password: user.password,
    });
    this.router.navigate(['register']);
  }
}
