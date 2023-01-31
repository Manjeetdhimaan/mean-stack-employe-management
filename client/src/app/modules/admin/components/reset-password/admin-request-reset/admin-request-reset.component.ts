import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AdminService } from '../../../services/admin.service';

@Component({
  selector: 'app-admin-request-reset',
  templateUrl: './admin-request-reset.component.html',
  styleUrls: ['./admin-request-reset.component.scss', '../../../../employe/components/employe-login/employe-login.component.scss']
})
export class AdminRequestResetComponent implements OnInit {

  RequestResetForm: FormGroup;
  forbiddenEmails: any;
  errorMessage: string;
  successMessage: string;
  IsvalidForm = true;

  constructor(
    private adminService: AdminService,
    private router: Router,
   ) {

  }


  ngOnInit() {
    this.RequestResetForm = new FormGroup({
      'email': new FormControl(null, [Validators.required, Validators.email], this.forbiddenEmails),
    });
  }


  RequestResetUser() {
    this.errorMessage = '';
    this.successMessage = '';
    this.RequestResetForm.value.domain = environment.domain;
    if (this.RequestResetForm.valid) {
      this.IsvalidForm = true;
      this.adminService.requestReset(this.RequestResetForm.value).subscribe(
        data => {
          this.RequestResetForm.reset();
          this.successMessage = "Reset password link sent to email sucessfully.";
        
        },
        err => {

          if (err.error.message) {
            this.errorMessage = err.error.message;
          }
        }
      );
    } else {
      this.IsvalidForm = false;
    }
  }

  onClearMsg() {
    this.errorMessage = '';
    this.successMessage = '';
  }
}
