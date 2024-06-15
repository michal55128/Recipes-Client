import { Component, OnInit } from '@angular/core';
import { User } from '../../shared/models/user';
import { UserService } from '../../shared/services/user.service';
import { error } from 'console';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-all-users',
  standalone: true,
  imports: [MatTableModule, CommonModule],
  templateUrl: './all-users.component.html',
  styleUrl: './all-users.component.scss'
})
export class AllUsersComponent implements OnInit {

  // users: User[] = [];

  // constructor(private userService: UserService) {}

  // ngOnInit(): void {
  //   this.userService.getUsers().subscribe(
  //     (data: User[]) => {
  //       console.log(data);
  //       this.users = data;
  //     },
  //     (error) => {
  //       console.error('Error fetching users:', error);
  //     }
  //   );
  // }

  

  displayedColumns: string[] = ['username', 'email', 'role'];
  usersList: User[] = [];
  isShowList: boolean = false

  constructor(private userService: UserService, private _snackBar: MatSnackBar, private router: Router) { }

  ngOnInit(): void {
    console.log("in");
    if (this.userService.token)

      this.userService.getUsers().subscribe(
        users => {
          console.log(users);
          if (!users.length) {
            this._snackBar.open('You must login again', 'login', {
              verticalPosition: 'top',
            }).onAction().subscribe(() => {
              const currentUserString = localStorage.getItem('currentUser');
              if (currentUserString) {
                const currentUser = JSON.parse(currentUserString);
                const email = currentUser.email;
                console.log(email);
                
                this.router.navigateByUrl('login', { state: { email: email } });
              }
            });
          } else {
            this.usersList = users;
            this.isShowList = true;
          }
        },
        error => {
          this._snackBar.open('You must login again', 'login',{ verticalPosition: 'top', });
          console.error(error);
        }
 

      );


  }


}
