import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { AdminService } from '../../services/admin.service';
import { map, take, timer } from 'rxjs';



@Component({
  selector: 'app-admin-register',
  templateUrl: './admin-register.component.html',
  styleUrls: ['./admin-register.component.scss', '../../../employe/components/employe-login/employe-login.component.scss']
})
export class AdminRegisterComponent implements OnInit {

  constructor(private adminService: AdminService, private router: Router, private formBuilder: FormBuilder, private activatedRoute: ActivatedRoute, private toastMsgService: ToasTMessageService) { }

  registerForm: FormGroup;
  otpForm: FormGroup;
  errMsg: String = '';
  isShowPassword: boolean = false;
  serverErrorMessages: string;
  serverSuccessMessages: string;

  thick: boolean = true;
  public timerInterval: any;
  public timerIntervalForOtp: any;
  display: any;
  displaySendOtpTime: any;

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params) => {
      if (Object.keys(params).length > 0) {
        if (params['screen'].toLowerCase() === "otp-verification") {
          const otpID = localStorage.getItem("otpID");
          console.log(otpID)
          if (!otpID) {
            console.log('no otp')
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
      otp: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]]
    });
  }

  timer(minute: number) {
    // let minute = 1;
    let seconds: number = minute * 60;
    let textSec: any = '0';
    let statSec: number = 60;
    const prefix = minute < 10 ? '0' : '';
    this.timerInterval = setInterval(() => {
      seconds--;
      if (statSec != 0) statSec--;
      else statSec = 59;

      if (statSec < 10) {
        textSec = '0' + statSec;
      } else textSec = statSec;

      this.display = `${prefix}${Math.floor(seconds / 60)}:${textSec}`;
      if (seconds == 0) {
        clearInterval(this.timerInterval);
      }
    }, 1000);
  }

  timerForResendOtp(minute: number) {
    // let minute = 1;
    let seconds: number = minute * 60;
    let textSec: any = '0';
    let statSec: number = 60;
    const prefix = minute < 10 ? '0' : '';
    this.timerIntervalForOtp = setInterval(() => {
      seconds--;
      if (statSec != 0) statSec--;
      else statSec = 59;

      if (statSec < 10) {
        textSec = '0' + statSec;
      } else textSec = statSec;
      this.displaySendOtpTime = `${prefix}${Math.floor(seconds / 60)}:${textSec}`;
      if (seconds == 0) {
        clearInterval(this.timerIntervalForOtp);
      }
    }, 1000);
  }

  submitRegisterForm() {
    if (!this.registerForm.valid) {
      return;
    }
    const data = this.registerForm.value;
    this.adminService.postAdmin(data).subscribe(
      (res: any) => {
        this.timerForResendOtp(1);
        this.timer(2);
        this.serverErrorMessages = '';
        this.serverSuccessMessages = res.message;
        localStorage.setItem('otpID', res['_id']);
        this.router.navigateByUrl(`/admin/register?screen=otp-verification`);
      },
      (err: any) => {
        if (err.status === 422) {
          console.log(err);
          // this.serverErrorMessages = err.error.join('<br/>');
        }
        else
          this.serverErrorMessages = err.error.message;
      }
    );
  }

  submitOtpForm() {
    this.serverErrorMessages = '';
    if (!this.otpForm.valid) {
      return;
    }
    const otpID = localStorage.getItem("otpID");
    const otpBody = Object.assign({}, this.otpForm.value, { adminId: String(otpID) })
    this.adminService.verifyOTP(otpBody).subscribe((res: any) => {
      this.serverSuccessMessages = res.message;
      this.toastMsgService.success(res.message);
      localStorage.removeItem("otpID");
      this.router.navigate(['/admin/login']);
    }, err => {
      console.log(err);
      this.serverErrorMessages = err.error.message;
    })
  }

  resendOTP() {
    clearInterval(this.timerInterval);
    const otpID = localStorage.getItem("otpID");
    const otpBody = Object.assign({}, { adminId: String(otpID) })
    this.adminService.resendOTP(otpBody).subscribe((res: any) => {
      this.timerForResendOtp(1);
      this.timer(2);
      this.serverSuccessMessages = res.message;
      this.toastMsgService.success(res.message);
      // this.router.navigate(['/admin/login']);
    }, err => {
      console.log(err);
      this.serverErrorMessages = err.error.message;
    })
  }

  toggleShowPasswordFeild() {
    this.isShowPassword = !this.isShowPassword;
  }

  onClearErrMsg() {
    this.serverErrorMessages = '';
  }
}