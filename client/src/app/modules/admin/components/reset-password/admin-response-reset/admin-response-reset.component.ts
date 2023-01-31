import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from '../../../services/admin.service';

@Component({
  selector: 'app-admin-response-reset',
  templateUrl: './admin-response-reset.component.html',
  styleUrls: ['./admin-response-reset.component.scss', '../../../../employe/components/employe-login/employe-login.component.scss']
})
export class AdminResponseResetComponent implements OnInit {

  ResponseResetForm: FormGroup;
  errorMessage: string;
  successMessage: string;
  isShowPassword: boolean = false;
  resetToken: null;
  CurrentState: any;
  IsResetFormValid = true;
  constructor(
    private adminService: AdminService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder ) {

    this.CurrentState = 'Wait';
    this.activatedRoute.params.subscribe(params => {
      this.resetToken = params['token'];
      this.VerifyToken();
    });
  }


  ngOnInit() {

    this.Init();
  }

  VerifyToken() {
    this.adminService.ValidatePasswordToken({ resettoken: this.resetToken }).subscribe(
      data => {
        this.CurrentState = 'Verified';
      },
      err => {
        this.CurrentState = 'NotVerified';
      }
    );
  }

  Init() {
    this.ResponseResetForm = this.fb.group(
      {
        resettoken: [this.resetToken],
        newPassword: ['', [Validators.required, Validators.minLength(4)]],
        confirmPassword: ['', [Validators.required, Validators.minLength(4)]]
      }
    );
  }

  Validate(passwordFormGroup: FormGroup) {
    const new_password = passwordFormGroup.controls['newPassword'].value;
    const confirm_password = passwordFormGroup.controls['confirmPassword'].value;

    if (confirm_password.length <= 0) {
      return null;
    }

    if (confirm_password !== new_password) {
      return {
        doesNotMatch: true
      };
    }

    return null;
  }


  ResetPassword(form: FormGroup) {
    this.errorMessage = '';
    this.successMessage = '';
    if (!form.valid || form.value.newPassword!=form.value.confirmPassword) {
      this.IsResetFormValid = false;
      return;
    }
    else {
      this.IsResetFormValid = true;
      this.adminService.newPassword(this.ResponseResetForm.value).subscribe(
        (data:any) => {
          this.ResponseResetForm.reset();
          this.successMessage = data.message;
        },
        err => {
          if (err.error.message) {
            this.errorMessage = err.error.message;
          }
        }
      );
    }
  }

  toggleShowPasswordFeild() {
    this.isShowPassword = !this.isShowPassword;
  }

  onClearMsg() {
    this.errorMessage = '';
    this.successMessage = '';
  }
}