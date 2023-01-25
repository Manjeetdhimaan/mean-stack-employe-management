import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-admin-register',
  templateUrl: './admin-register.component.html',
  styleUrls: ['./admin-register.component.scss', '../../../employe/components/employe-login/employe-login.component.scss']
})
export class AdminRegisterComponent implements OnInit  {

  constructor(private adminService: AdminService, private router: Router, private formBuilder: FormBuilder, private activatedRoute: ActivatedRoute, private toastMsgService: ToasTMessageService) { }

  registerForm: FormGroup;
  otpForm: FormGroup;
  errMsg: String = '';
  isShowPassword: boolean = false;
  serverErrorMessages: string;
  serverSuccessMessages: string;

  thick: boolean = true;

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params) => {
      console.log(params)
      if (Object.keys(params).length > 0) {
        if(params['screen'].toLowerCase() === "otp-verification") {
          const otpID = localStorage.getItem("otpID");
          if (!otpID) {
            this.router.navigate(['/admin/register']);
            this.serverSuccessMessages = '';
          }
          else {
            this.serverSuccessMessages = 'Otp'
          }
        }
      }
    })
    this.registerForm = this.formBuilder.group({
      fullName: ['', [Validators.required]],
      email: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });

    this.otpForm = this.formBuilder.group({
      otp: ['', [Validators.required]]
    });

    // if (this.adminService.isLoggedIn()) {
    //   this.router.navigateByUrl(`/admin/employees`);
    // }

  }

  submitRegisterForm() {
    if (!this.registerForm.valid) {
      return;
    }
    const data  = this.registerForm.value;
    this.adminService.postAdmin(data).subscribe(
      (res:any) => {
        this.serverErrorMessages = '';
        console.log(res);
        this.serverSuccessMessages = res.message;
        localStorage.setItem('otpID', res['_id']);
        this.router.navigateByUrl(`/admin/register?screen=otp-verification`);
        // this.router.navigate(['/admin/register?screen=otp-verification'])
      },
      (err:any) => {
        if (err.status === 422) {
          console.log(err);
          // this.serverErrorMessages = err.error.join('<br/>');
        }
        else
          this.serverErrorMessages = err.error.message;
      }
    );
  }

  toggleShowPasswordFeild() {
    this.isShowPassword = !this.isShowPassword;
  }

  onClearErrMsg() {
    this.serverErrorMessages = '';
  }

  submitOtpForm () {
    this.serverErrorMessages = '';
    if(!this.otpForm.valid){
      return;
    }
    const otpID = localStorage.getItem("otpID");
    const otpBody = Object.assign({}, this.otpForm.value, {adminId: String(otpID)})
    this.adminService.verifyOtp(otpBody).subscribe((res:any) => {
      console.log(res);
      this.serverSuccessMessages = res.message;
      this.toastMsgService.success(res.message);
      this.router.navigate(['/admin/login']);
    }, err => {
      console.log(err);
      this.serverErrorMessages = err.error.message;
    })
  }
}