import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.scss', '../../../employe/components/employe-login/employe-login.component.scss']
})
export class AdminLoginComponent implements OnInit {

  constructor(private adminService: AdminService, private router: Router, private formBuilder: FormBuilder) { }

  loginForm: FormGroup;
  errMsg: String = '';
  isShowPassword: boolean = false;
  serverErrorMessages: string;

  thick: boolean = true

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });

    // if (this.adminService.isLoggedIn()) {
    //   this.router.navigateByUrl(`/admin/employees`);
    // }

  }

  submitForm() {
    // const data  = this.loginForm.value
    // data.fullName = "Admin"
    // data.phone = "1111222233"
    // this.adminService.postAdmin(data).subscribe(
    //   res => {
    //     console.log(res)
    //     // this.router.navigate(['/'])
    //   },
    //   err => {
    //     if (err.status === 422) {
    //       console.log(err)
    //       // this.serverErrorMessages = err.error.join('<br/>');
    //     }
    //     else
    //       this.serverErrorMessages = 'Something went wrong.Please contact admin.';
    //   }
    // );


    this.adminService.login(this.loginForm.value).subscribe(
      (res: any) => {
        this.adminService.setToken(res['token']);
        this.router.navigateByUrl(`/admin/employees`);
      },
      err => {
        this.adminService.isAdmin= false;
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