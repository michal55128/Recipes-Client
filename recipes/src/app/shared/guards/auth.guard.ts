import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

export const authGuard: CanActivateFn = (route, state) => {

  const userService=inject(UserService);
  const snackBar = inject(MatSnackBar);
  const router = inject(Router);

  // if (userService.token) {
  //   return true;
  // } else {
  //   snackBar.open('You must login again','login',  {
  //     verticalPosition: 'top',
  //   }).onAction().subscribe(() => {
  //     const currentUserString = localStorage.getItem('currentUser');
  //     if (currentUserString) {
  //       const currentUser = JSON.parse(currentUserString);
  //       const email = currentUser.email;
  //       console.log(email);
  //     } 
  //        router.navigate(['/login']);

  //   });
  //   return false;
  // }

  if (userService.token) {
    return true; // Allow navigation if the user is authenticated
  } else {
    // Configure snackbar appearance
    const config = new MatSnackBarConfig();
    config.verticalPosition = 'top';
    config.panelClass = ['yellow-snackbar']; // Define your custom CSS class here

    // Show snackbar and navigate to login page on action
    snackBar.open('You must login again', 'Login', config).onAction().subscribe(() => {
      // Optional: Retrieve email from local storage or other source if needed
      const currentUserString = localStorage.getItem('currentUser');
      if (currentUserString) {
        const currentUser = JSON.parse(currentUserString);
        const email = currentUser.email;
        console.log(email);
      }
      // Navigate to the login page
      router.navigate(['/login']);
    });

    return false; // Prevent navigation as user is not authenticated
  }

};
