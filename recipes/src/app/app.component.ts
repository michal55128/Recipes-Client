import { Component, OnInit, inject } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';

import {MatIconModule} from '@angular/material/icon';
import { LoginComponent } from './components/login/login.component';
import { UserService } from './shared/services/user.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,RouterModule,MatIconModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{
  title = 'recipes';
userService=inject(UserService);

ngOnInit(){
 {
  console.log(this.userService.getUserDetails());
  
    // console.log(this.currentUser);
    
    if (!this.currentUser) {
      return 'person_outline'; 
    } else if (this.currentUser === 'admin') {
      return 'verified_user'; 
    } else {
      return 'person'; 
    }
  }
}
  currentUser = this.userService.currentUser?.role; 
  getUserIcon(): string {
   // console.log(this.currentUser);
    
    if (!this.currentUser) {
      return 'person_outline'; 
    } else if (this.currentUser === 'admin') {
      return 'verified_user'; 
    } else {
      return 'person'; 
    }
  }
}

