import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-employee-change-password',
  templateUrl: './employee-change-password.component.html',
  styleUrls: ['./employee-change-password.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmployeeChangePasswordComponent implements OnInit {

  constructor(public formBuilder: FormBuilder, private userService: UserService, private router: Router) { }
  changePasswordForm: FormGroup;

  ngOnInit(): void {
    this.changePasswordForm = this.formBuilder.group({
      password: [],
    });
  }

  submit() {
    const userPayloadId = this.userService.getUserPayload()['_id'];
    const formData = this.changePasswordForm.controls['password'].value;
    try {
      if (!this.changePasswordForm.valid) {
        // show some error message
        console.log('Form values are not valid');
        return;
      }
      this.userService.changePassword(formData).subscribe((res:any) => {
        console.log(res);
        // this.showSucessMessage = true;
        if(res.success === true){
          this.router.navigate([`/employee/profile`]);
        }
      },
        err => {
          console.log(err);
        })
    }
    catch {
      console.log('some error occured');
    }
  }

  onCancelSubmit() {
    this.changePasswordForm.reset();
    this.router.navigate(['/employee/profile']);
  }
}
