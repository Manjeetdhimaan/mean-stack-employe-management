import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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

    // if (this.userService.isLoggedIn()) {
    //   this.router.navigateByUrl(`/employee/profile`);
    // }

  }

  submitForm() {
    // const data  = this.loginForm.value
    // data.fullName = "Manjeet Singh"
    // data.phone = "1111222233"
    // this.userService.postUser(data).subscribe(
    //   res => {
    //     this.router.navigate(['/'])
    //   },
    //   err => {
    //     if (err.status === 422) {
    //       this.serverErrorMessages = err.error.join('<br/>');
    //     }
    //     else
    //       this.serverErrorMessages = 'Something went wrong.Please contact admin.';
    //   }
    // );


    this.userService.login(this.loginForm.value).subscribe(
      (res: any) => {
        localStorage.setItem('name', res['name']);
        this.userService.setToken(res['token']);
        this.router.navigate([`/employee/profile`]);
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
