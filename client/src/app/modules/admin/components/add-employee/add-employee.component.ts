import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DiscardChangesComponent } from 'src/app/shared/components/ui-components/discard-changes/discard-changes.component';
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
  wasFormChanged = false;

  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
    private adminService: AdminService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.addCusForm = this.fb.group({
      firstname: [null, [Validators.required, Validators.pattern('[a-zA-Z]+([a-zA-Z ]+)*')]],
      lastname: [null, [Validators.required, Validators.pattern('[a-zA-Z]+([a-zA-Z ]+)*')]],
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, Validators.minLength(6)]],
      service: [null, [Validators.required]],
      joiningDate: [null, [Validators.required]],
      gender: [null, [Validators.required]],
      pNumber: [null, [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern('[- +()0-9]+')]],
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


  // public cancel(): void { // To cancel the dialog window
  //   this.dialogRef.close();
  //   }
    
    // public cancelN(): void { 
    //     this.dialog.closeAll();
    // }

    cancelN(): void {
      console.log(this.wasFormChanged);
      if(this.addCusForm.dirty) {
        const dialogRef = this.dialog.open(DiscardChangesComponent, {
          width: '300px',
          data: {confirmBtnText: 'Discard', cancelBtnText: 'Cancel', confirmationText: 'Are you sure you want to discard the changes?'}
        });
      } else {
        this.dialog.closeAll();
      }
    }

    numberOnly(event: any): boolean {
      const charCode = (event.which) ? event.which : event.keyCode;
      if (charCode > 31 && (charCode < 48 || charCode > 57) || event.target.value.length >=10) {
        return false;
      }
      return true;
    }

    onAddEmployee() {
      if (!this.addCusForm.valid) {
        return;
      }
      const formBody = {
        fullName: String(this.addCusForm.value.firstname) + " " + String(this.addCusForm.value.lastname),
        email: this.addCusForm.value.email,
        password: this.addCusForm.value.password,
        service: this.addCusForm.value.service,
        phone: this.addCusForm.value.pNumber,
        joindate: this.addCusForm.value.joiningDate
      }

      this.adminService.postEmp(formBody).subscribe((res:any) => {
        console.log(res);
        // this.toastMessageService.success(res['message']);
        this.router.navigate(['admin/employees']);
        this.dialog.closeAll();
      }, error => {
        console.log("error", error);
        // this.toastMessageService.info(error.error.message);
      })
    }

}