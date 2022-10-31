import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { fade, slideUp } from 'src/app/shared/common/animations/animations';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-employe-login',
  templateUrl: './employe-login.component.html',
  styleUrls: ['./employe-login.component.scss'],
  animations: [
    fade,
    slideUp
  ]
})
export class EmployeLoginComponent implements OnInit {

  constructor(private userService: UserService, private router: Router, private formBuilder: FormBuilder) { }

  loginForm: FormGroup;
  errMsg: String = '';
  isShowPassword: boolean = false;
  serverErrorMessages: string;

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });

    if (this.userService.isLoggedIn()) {
      this.router.navigateByUrl(`/profile`);
    }

  }

  submitForm() {
    this.userService.login(this.loginForm.value).subscribe(
      (res: any) => {
        this.userService.setToken(res['token']);
        console.log('login successful')
        this.router.navigateByUrl(`/profile`);
      },
      err => {
        this.serverErrorMessages = err.error.message;
        // setTimeout(() => {
        //   this.serverErrorMessages = '';
        // }, 8000);
      }
    );
  }

  toggleShowPasswordFeild() {
    this.isShowPassword = !this.isShowPassword;
  }

  onClearErrMsg() {
    this.serverErrorMessages = '';
  }

}
