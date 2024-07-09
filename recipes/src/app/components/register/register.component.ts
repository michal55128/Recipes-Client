import { Component, OnInit, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { SignResponse, UserService } from '../../shared/services/user.service';
import { User } from '../../shared/models/user';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ButtonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent implements OnInit {
  private userService = inject(UserService);

  userForm: FormGroup;
  disableform: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private routerUrl: Router,
    private _snackBar: MatSnackBar
  ) {
    this.userForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(10),
        ],
      ],
      username: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(30),
        ],
      ],
      city: [
        '',
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(100),
          Validators.pattern(/^[\p{L}\s-]+$/u),
        ],
      ],
    });
  }

  user: User = {
    password: '',
    email: '',
    city: '',
    role: 'user',
    username: '',
  };

  userExist: boolean = false;

  ngOnInit() {
    this.user = this.userService.getUserDetails();
    console.log(this.user);
    this.userForm.patchValue({
      email: this.user.email,
      password: this.user.password,
    });
  }

  register(
    email: HTMLInputElement,
    password: HTMLInputElement,
    username: HTMLInputElement,
    city: HTMLInputElement
  ) {
    if (this.userForm.invalid) {
      console.log('פרטים לא תקינים, אנא תקן את השדות המסומנים');
      this.disableform = false;
      return;
    }
    this.disableform = true;

    const user: User = {
      email: email.value,
      password: password.value,
      username: username.value,
      city: city.value,
      role: 'user',
    };
    console.log(user);

    this.userService.register(user).subscribe(
      (data) => {
        if (data && data.status === 201) {
          const responseBody: SignResponse = data.body!;
          console.log(responseBody);
          this.userService.token = responseBody.token;
          this.routerUrl.navigateByUrl('allrecipes');
        } 
        console.log(data);
        console.log('signUp success!!');
   
      },
      (error) => {
        if (error.status === 409) {
          this.userExist = true;
          console.error('user is exist', error);
        } else {
          console.error('erorr! :', error);
        }
        console.error('An error occurred while signup in:', error);
        this.userService.setUserDetails(user);
        this.routerUrl.navigate(['register']);
      }
    );
  }
}
