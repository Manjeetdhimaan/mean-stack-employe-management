import { ChangeDetectionStrategy, Component, OnInit, forwardRef, OnDestroy, Input } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AdminService } from 'src/app/modules/admin/services/admin.service';
import { ControlValueAccessor, FormBuilder, FormControl, FormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-create-payroll',
  templateUrl: './create-payroll.component.html',
  styleUrls: ['./create-payroll.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CreatePayrollComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => CreatePayrollComponent),
      multi: true,
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})


export class CreatePayrollComponent implements OnInit, ControlValueAccessor, OnDestroy {

  userDetails: any;
  subscriptions: Subscription[] = [];
  // earnings
 
  @Input() totalEarning: number = 0;
  @Input() isAdmin: boolean = false;
  @Input() submitted: boolean = false;
  // end of earnings
  // deductions
 
  @Input() totalDeductions: number = 0;
  // end of  deductions
  @Input() payRollForm: FormGroup;
  // 
  id: string;

 
  constructor(private activatedRoute: ActivatedRoute,
    private adminService: AdminService, private formBuilder: FormBuilder) { 
      this.payRollForm = this.formBuilder.group({
        month: [null, Validators.required],
        basic: [0, Validators.required],
        da: [0, Validators.required],
        hra: [0, Validators.required],
        wa: [0, Validators.required],
        ca: [0, Validators.required],
        cca: [0, Validators.required],
        ma: [0, Validators.required],
        SalesIncentive: [0, Validators.required],
        LeaveEncashment: [0, Validators.required],
        HolidayWages: [0, Validators.required],
        SpecialAllowance: [0, Validators.required],
        Bonus: [0, Validators.required],
        IndividualIncentive: [0, Validators.required],
        pf: [0, Validators.required],
        esi: [0, Validators.required],
        tds: [0, Validators.required],
        lop: [0, Validators.required],
        pt: [0, Validators.required],
        SPL_Deduction: [0, Validators.required],
        ewf: [0, Validators.required],
        cd: [0, Validators.required],
      });
      this.subscriptions.push(
        this.payRollForm.valueChanges.subscribe(value => {
          this.onChange(value);
          this.onTouched();
        })
      );
    }

    writeValue(value:any) {
      if (value) {
        this.value = value;
      }
  
      if (value === null) {
        this.payRollForm.reset();
      }
    }

    get value(): any {
      return this.payRollForm.value;
    }
  
    set value(value: any) {
      this.payRollForm.patchValue(value);
      this.onChange(value);
      this.onTouched();
    }

  ngOnInit(): void {
  }


  onChange: any = () => {};
  onTouched: any = () => {};

  registerOnChange(fn:any) {
    this.onChange = fn;
  }

 

  registerOnTouched(fn:any) {
    this.onTouched = fn;
  }

  validate(_: FormControl) {
    return this.payRollForm.valid ? null : { payForm: { valid: false, }, };
  }

  reset() {
    this.payRollForm.reset();
  }

  get f() {
    return this.payRollForm.controls;
  }



  onSavePayroll() {
    this.submitted = true;
    this.activatedRoute.params.subscribe((param: Params) => {
      this.id = param['id'];
    })
    let checkMonth = ""
    const inputFeilds = document.querySelectorAll("input");
    const validInputs = Array.from(inputFeilds).filter(input => input.value == "");
    const payrolls = {
      month: this.payRollForm.value.month,
      basic: this.payRollForm.value.basic,
      da: this.payRollForm.value.da,
      hra: this.payRollForm.value.hra,
      wa: this.payRollForm.value.wa,
      ca: this.payRollForm.value.ca,
      cca: this.payRollForm.value.cca,
      ma: this.payRollForm.value.ma,
      SalesIncentive: this.payRollForm.value.SalesIncentive,
      LeaveEncashment: this.payRollForm.value.LeaveEncashment,
      HolidayWages: this.payRollForm.value.HolidayWages,
      SpecialAllowance: this.payRollForm.value.SpecialAllowance,
      Bonus: this.payRollForm.value.Bonus,
      IndividualIncentive: this.payRollForm.value.IndividualIncentive,
      totalEarning: this.onGetTotalEarning(),

      pf: this.payRollForm.value.pf,
      esi: this.payRollForm.value.esi,
      tds: this.payRollForm.value.tds,
      lop: this.payRollForm.value.lop,
      pt: this.payRollForm.value.pt,
      SPL_Deduction: this.payRollForm.value.SPL_Deduction,
      ewf: this.payRollForm.value.ewf,
      cd: this.payRollForm.value.cd,
      totalDeductions: this.onGetTotalDeductions(),
      netPay: this.getNetPay()
    }

    this.adminService.createPayroll(this.id, payrolls).subscribe((res:any) => {
      console.log(res);
    }, err => {
      console.log(err);
    })

    // this.user.payroll.map((a: any) => {
    //   if (a.month == payrolls.month) {
    //     checkMonth = "checked";
    //   }

    // })
    // if (checkMonth == "checked") {
    //   // Swal.fire('Error!', `${this.user.fullname}'s salary slip already created for ${payrolls.month}`, 'error')

    //   this.isLoading = false;
    //   return
    // }
    // if (this.payRollForm.value.month == '' || !this.payRollForm.value.month) {
      
    //   // Swal.fire('Error!', 'Please select a month for payment', 'error');
    //   window.scrollTo({ top: 0, behavior: 'smooth' });
    //   this.isLoading = false;
    //   return;
    // }
    // if (validInputs.length > 0) {
    //   window.scrollTo({ top: 0, behavior: 'smooth' });
    //   // Swal.fire('Error!', 'Please fill all the values', 'error');
    //   this.isLoading = false;
    //   return;
    // }

    // this.http.post(`${this.apiService.url}/users/${this.id}/salary`, payrolls).subscribe((res: any) => {
    //   this.user.payroll = res.payroll;
    //   if (checkMonth !== "checked") {
    //     this.isLoading = false;
    //     // Swal.fire('Success!', `${res.fullname}'s salary slip created successfully for ${payrolls.month}`, 'success');
    //     checkMonth = "checked";
    //   }
    // }, error => {
    //   checkMonth = "checked";
    //   this.isLoading = false;
    //   console.log(error)
    //   // Swal.fire('Error!', error, 'error')
    // })
  }
  onGetTotalEarning() {
    return (this.payRollForm.value.basic +
      this.payRollForm.value.da +
      this.payRollForm.value.hra +
      this.payRollForm.value.wa +
      this.payRollForm.value.ca +
      this.payRollForm.value.cca +
      this.payRollForm.value.ma +
      this.payRollForm.value.SalesIncentive +
      this.payRollForm.value.LeaveEncashment +
      this.payRollForm.value.HolidayWages +
      this.payRollForm.value.SpecialAllowance +
      this.payRollForm.value.Bonus +
      this.payRollForm.value.IndividualIncentive)
  }

  onGetTotalDeductions() {
    return (this.payRollForm.value.pf +
      this.payRollForm.value.esi +
      this.payRollForm.value.tds +
      this.payRollForm.value.lop +
      this.payRollForm.value.pt +
      this.payRollForm.value.SPL_Deduction +
      this.payRollForm.value.ewf +
      this.payRollForm.value.cd)
  }

  getNetPay() {
    return this.onGetTotalEarning() - this.onGetTotalDeductions();
  }


  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }
}

