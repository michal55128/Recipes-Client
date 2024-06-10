import { HttpInterceptorFn } from '@angular/common/http';
import { Inject } from '@angular/core';
import { UserService } from '../services/user.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
const userService=Inject(UserService);
const token=userService.token;
if(token){
  req=req.clone({setHeaders:{ Authorization: `Bearer ${token}`}});
}
  return next(req);
};
