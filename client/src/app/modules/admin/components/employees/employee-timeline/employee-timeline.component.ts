import { Component, OnInit, Inject, Injector, } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { AdminService } from '../../../services/admin.service';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';

@Component({
  selector: 'app-employee-timeline',
  templateUrl: './employee-timeline.component.html',
  styleUrls: ['./employee-timeline.component.scss']
})
export class EmployeeTimelineComponent implements OnInit {

  constructor(private adminService: AdminService, private activatedRoute: ActivatedRoute, private formBuilder: FormBuilder, private router: Router, @Inject(Injector) private readonly injector: Injector) { }

  private get toastMessageService() {
    return this.injector.get(ToasTMessageService);
}
  userDetails: any = {};
  firstName: string = '';
  lastName: string = '';
  profileImageUrl: any =
    'https://g99plus.b-cdn.net/AEMR/assets/img/profileDefault.png';

  attendance: any[];
  id: string;
  payroll: any[];
  totalDeductions: number = 0;
  totalEarning: number = 0;
  isAdmin: boolean = true;
  submitted: boolean = false;
  payRollForm: FormGroup = this.formBuilder.group({
    payForm: [],
  });;

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.id = params['id'];
    });

    this.adminService.getUser(this.id).subscribe(
      (res: any) => {
        this.userDetails = res['user'];
        this.payroll = this.userDetails.payroll.sort((a: any, b: any) => a.month?.slice(0, 4) - b.month?.slice(0, 4)).reverse();
        this.profileImageUrl = this.userDetails['imgUrl']
        this.attendance = this.userDetails.attendance.reverse();
        this.firstName = this.userDetails['fullName'].toString().split(" ")[0].trim();
        const lastNameArray = this.userDetails['fullName'].toString().split(" ").slice(1);
        this.lastName = '';
        lastNameArray.map((n: string, i: number) => {
          this.lastName += (n) + ' '
        });

        // create payroll logic 
        console.log(res['user'].attendance)

        const lastpay = this.userDetails.payroll.reverse();

        console.log(lastpay)

        if (lastpay.length > 0) {
          lastpay.map((pay: any) => {
            if (!pay) {
              pay = 0;
            }
          });

          this.totalEarning =
            lastpay[0].basic +
            lastpay[0].da +
            lastpay[0].hra +
            lastpay[0].wa +
            lastpay[0].ca +
            lastpay[0].cca +
            lastpay[0].ma +
            lastpay[0].SalesIncentive +
            lastpay[0].LeaveEncashment +
            lastpay[0].HolidayWages +
            lastpay[0].SpecialAllowance +
            lastpay[0].Bonus +
            lastpay[0].IndividualIncentive;



          this.totalDeductions = lastpay[0].pf +
            lastpay[0].esi +
            lastpay[0].tds +
            lastpay[0].lop +
            lastpay[0].pt +
            lastpay[0].SPL_Deduction +
            lastpay[0].ewf +
            lastpay[0].cd

          this.payRollForm.controls['payForm'].setValue({
            month: null,
            basic: lastpay[0].basic,
            da: lastpay[0].da,
            hra: lastpay[0].hra,
            wa: lastpay[0].wa,
            ca: lastpay[0].ca,
            cca: lastpay[0].cca,
            ma: lastpay[0].ma,
            SalesIncentive: lastpay[0].SalesIncentive,
            LeaveEncashment: lastpay[0].LeaveEncashment,
            HolidayWages: lastpay[0].HolidayWages,
            SpecialAllowance: lastpay[0].SpecialAllowance,
            Bonus: lastpay[0].Bonus,
            IndividualIncentive: lastpay[0].IndividualIncentive,
            pf: lastpay[0].pf,
            esi: lastpay[0].esi,
            tds: lastpay[0].tds,
            lop: lastpay[0].lop,
            pt: lastpay[0].pt,
            SPL_Deduction: lastpay[0].SPL_Deduction,
            ewf: lastpay[0].ewf,
            cd: lastpay[0].cd,
          })
        }
      },
      err => {
        console.log(err);
      }
    );
  }

  onGetTotalEarning() {
    return (this.payRollForm.value.payForm.basic +
      this.payRollForm.value.payForm.da +
      this.payRollForm.value.payForm.hra +
      this.payRollForm.value.payForm.wa +
      this.payRollForm.value.payForm.ca +
      this.payRollForm.value.payForm.cca +
      this.payRollForm.value.payForm.ma +
      this.payRollForm.value.payForm.SalesIncentive +
      this.payRollForm.value.payForm.LeaveEncashment +
      this.payRollForm.value.payForm.HolidayWages +
      this.payRollForm.value.payForm.SpecialAllowance +
      this.payRollForm.value.payForm.Bonus +
      this.payRollForm.value.payForm.IndividualIncentive)
  }

  onGetTotalDeductions() {
    return (this.payRollForm.value.payForm.pf +
      this.payRollForm.value.payForm.esi +
      this.payRollForm.value.payForm.tds +
      this.payRollForm.value.payForm.lop +
      this.payRollForm.value.payForm.pt +
      this.payRollForm.value.payForm.SPL_Deduction +
      this.payRollForm.value.payForm.ewf +
      this.payRollForm.value.payForm.cd)
  }

  onSubmitPayRollForm(event: any) {
    this.submitted = true;
    console.log(this.payRollForm.valid);
    if(!this.payRollForm.valid) {
      this.toastMessageService.error(`Please fill all the required fields`);
      return;
    }
    event.totalDeductions = this.onGetTotalDeductions();
    event.totalEarnings = this.onGetTotalEarning();
    event.netPay = this.onGetTotalEarning() - this.onGetTotalDeductions();
    this.adminService.createPayroll(this.id, event).subscribe((res: any) => {
      console.log(res);
      this.toastMessageService.success(res['message']);
      this.router.navigate([`/admin/employees`]);
    }, err => {
      console.log(err);
      this.toastMessageService.error(err.error['message']);
    })
  }

  onCancelSubmitPayRollForm() {
    this.router.navigate([`/admin/employees`]);
  }

}
