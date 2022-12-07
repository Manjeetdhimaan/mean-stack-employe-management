import { HttpClient } from '@angular/common/http';
import { Component, Inject, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { slideUp } from 'src/app/shared/common/animations/animations';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-admin-change-password',
  templateUrl: './admin-change-password.component.html',
  styleUrls: ['./admin-change-password.component.scss'],
  animations: [slideUp]
})
export class AdminChangePasswordComponent implements OnInit {

  constructor(public formBuilder: FormBuilder, private adminService: AdminService, private router: Router, private http: HttpClient, @Inject(Injector) private readonly injector: Injector) { }

  private get toastMessageService() {
    return this.injector.get(ToasTMessageService);
  }
  changePasswordForm: FormGroup;

  ngOnInit(): void {

    this.changePasswordForm = this.formBuilder.group({
      password: [],
    });
  }

  submit() {
    const formData = this.changePasswordForm.controls['password'].value;
    try {
      if (!this.changePasswordForm.valid) {
        // show some error message
        return;
      }
      this.adminService.changePassword(formData).subscribe((res: any) => {
        // this.showSucessMessage = true;
        if (res.success === true) {
          this.toastMessageService.success(res.message);
          this.router.navigate([`/admin/employees`]);
        }
      },
        err => {
          console.log(err);
          this.toastMessageService.info(err.error.message);
        })
    }
    catch {
      console.log('some error occured');
    }
  }

  onCancelSubmit() {
    this.changePasswordForm.reset();
    this.router.navigate(['/admin/employees']);
  }
}
