import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';

export const authGuard: CanActivateFn = (route, state) => {

  const userService=inject(UserService);
  const snackBar = inject(MatSnackBar);
  const router = inject(Router);

  if (userService.token) {
    return true;
  } else {
    snackBar.open('You must login again', 'login',  {
      verticalPosition: 'top',
    }).onAction().subscribe(() => {
      const currentUserString = localStorage.getItem('currentUser');
      if (currentUserString) {
        const currentUser = JSON.parse(currentUserString);
        const email = currentUser.email;
        console.log(email);
        
        router.navigateByUrl('login', { state: { email: email } });
      }
    });
    return false;
  }


};
