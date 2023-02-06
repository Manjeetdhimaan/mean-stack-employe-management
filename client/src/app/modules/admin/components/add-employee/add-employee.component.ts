import { Component, OnInit, Inject, Injector } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DiscardChangesComponent } from 'src/app/shared/components/ui-components/discard-changes/discard-changes.component';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.scss']
})
export class AddEmployeeComponent implements OnInit {

  public breakpoint: number; // Breakpoint observer code
  public fname: string = `Ramesh`;
  public lname: string = `Suresh`;
  public addCusForm: FormGroup;
  submit: boolean= false;
  wasFormChanged = false;

  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
    private adminService: AdminService,
    private router: Router, @Inject(Injector) private readonly injector: Injector
  ) { }

  private get toastMessageService() {
    return this.injector.get(ToasTMessageService);
  }

  ngOnInit(): void {
    this.addCusForm = this.fb.group({
      fullName: [null, [Validators.required, Validators.pattern('[a-zA-Z]+([a-zA-Z ]+)*')]],
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, Validators.minLength(6)]],
      confirmPassword: [null, [Validators.required, Validators.minLength(6)]],
      service: [null, [Validators.required]],
      joiningDate: [null, [Validators.required]],
      gender: [null, [Validators.required]],
      pNumber: [null, [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern('[- +()0-9]+')]],
    },
      {
        validator: this.ConfirmedValidator('password', 'confirmPassword'),
      });
    this.breakpoint = window.innerWidth <= 600 ? 1 : 3; // Breakpoint observer code
  }

  public onAddCus(): void {
    this.markAsDirty(this.addCusForm);
  }

  // tslint:disable-next-line:no-any
  public onResize(event: any): void {
    this.breakpoint = event.target.innerWidth <= 600 ? 1 : 2;
  }

  private markAsDirty(group: FormGroup): void {
    group.markAsDirty();
    // tslint:disable-next-line:forin
    for (const i in group.controls) {
      group.controls[i].markAsDirty();
    }
  }

  formChanged() {
    this.wasFormChanged = true;
  }

  cancelN(): void {
    if (this.addCusForm.dirty) {
      const dialogRef = this.dialog.open(DiscardChangesComponent, {
        width: '300px',
        data: { confirmBtnText: 'Discard', cancelBtnText: 'Cancel', confirmationText: 'Are you sure you want to discard the changes?' }
      });
    } else {
      this.dialog.closeAll();
    }
  }

  numberOnly(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57) || event.target.value.length >= 10) {
      return false;
    }
    return true;
  }

  ConfirmedValidator(controlName: string, matchingControlName: string) {

    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];
      if (
        matchingControl.errors &&
        !matchingControl.errors['confirmedValidator']
      ) {
        return;
      }
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ confirmedValidator: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }

  onAddEmployee() {
    this.submit = true;
    if (!this.addCusForm.valid) {
      return;
    }
    const formBody = {
      fullName: this.addCusForm.value.fullName,
      email: this.addCusForm.value.email,
      password: this.addCusForm.value.password,
      confirmPassword: this.addCusForm.value.confirmPassword,
      service: this.addCusForm.value.service,
      phone: this.addCusForm.value.pNumber,
      gender: this.addCusForm.value.gender,
      joindate: this.addCusForm.value.joiningDate
    }

    this.adminService.postEmp(formBody).subscribe((res: any) => {
      this.toastMessageService.success(res['message']);
      if (this.router.url.split('?')[0] === '/admin/employees') {
        this.router.navigate(['admin/employees/leaves/check']);
      }
      else {
        this.router.navigate(['admin/employees']);
      }
      this.dialog.closeAll();
    }, error => {
      console.log("error", error);
      if (Array.isArray(error.error)) {
        this.toastMessageService.info(error.error[0]);
        if (this.router.url.split('?')[0] === '/admin/employees') {
          this.router.navigate(['admin/employees/leaves/check']);
        }
        else {
          this.router.navigate(['admin/employees']);
        }
      }
      else {
        this.toastMessageService.info(error.error.message);
        if (this.router.url.split('?')[0] === '/admin/employees') {
          this.router.navigate(['admin/employees/leaves/check']);
        }
        else {
          this.router.navigate(['admin/employees']);
        }
      }
    })
  }

}
