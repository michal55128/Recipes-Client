import { CanActivateFn } from '@angular/router';
import { UserService } from '../services/user.service';
import { inject } from '@angular/core';

export const isAdminGuard: CanActivateFn = (route, state) => {

  const userService = inject(UserService);
    return userService.currentUser?.role == 'admin' ? true : false;

};
