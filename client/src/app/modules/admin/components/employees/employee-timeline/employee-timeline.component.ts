import { Component, OnInit, Inject, Injector, ViewChild, ElementRef} from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AdminService } from '../../../services/admin.service';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { MatDialog } from '@angular/material/dialog';
import { DiscardChangesComponent } from 'src/app/shared/components/ui-components/discard-changes/discard-changes.component';
import { NoopScrollStrategy } from '@angular/cdk/overlay';
const MONTHS = {
  0: "Jan",
  1: "Feb",
  2: "Mar",
  3: "Apr",
  4: "May",
  5: "Jun",
  6: "Jul",
  7: "Aug",
  8: "Sep",
  9: "Oct",
  10: "Nov",
  11: "Dec",
}

@Component({
  selector: 'app-employee-timeline',
  templateUrl: './employee-timeline.component.html',
  styleUrls: ['./employee-timeline.component.scss']
})


export class EmployeeTimelineComponent implements OnInit {

  constructor(private adminService: AdminService, private activatedRoute: ActivatedRoute, private formBuilder: FormBuilder, private router: Router, @Inject(Injector) private readonly injector: Injector, public dialog: MatDialog) { }

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
  });

  @ViewChild('modalBackground') modalBackground: ElementRef;


  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.id = params['id'];
    });

    this.adminService.getUser(this.id).subscribe(
      (res: any) => {
        this.userDetails = res['user'];
        this.payroll = this.userDetails.payroll.slice().sort((a: any, b: any) => a.month?.slice(0, 4) - b.month?.slice(0, 4)).reverse();
        this.profileImageUrl = this.userDetails['imgUrl']
        this.attendance = this.userDetails.attendance.reverse();
        this.firstName = this.userDetails['fullName'].slice().toString().split(" ")[0].trim();
        const lastNameArray = this.userDetails['fullName'].slice().toString().split(" ").slice(1);
        this.lastName = '';
        lastNameArray.map((n: string, i: number) => {
          this.lastName += (n) + ' '
        });

        const d = new Date(this.userDetails?.joindate);
        console.log(d)
        Object.entries(MONTHS).forEach(
          ([key, value]) => {
            if (+key == +d.getMonth()) {
              const date = d.getDate();
              const month = value;
              const year = d.getFullYear();
              this.userDetails.joindate = `${month} ${date} ${year}`
            }
          }
        );


        // create payroll logic 

        const reversedPay = this.userDetails.payroll.reverse();

        if (reversedPay.length > 0) {
          reversedPay.map((pay: any) => {
            if (!pay) {
              pay = 0;
            }
          });

          this.totalEarning =
            reversedPay[0].basic +
            reversedPay[0].da +
            reversedPay[0].hra +
            reversedPay[0].wa +
            reversedPay[0].ca +
            reversedPay[0].cca +
            reversedPay[0].ma +
            reversedPay[0].SalesIncentive +
            reversedPay[0].LeaveEncashment +
            reversedPay[0].HolidayWages +
            reversedPay[0].SpecialAllowance +
            reversedPay[0].Bonus +
            reversedPay[0].IndividualIncentive;

          this.totalDeductions = reversedPay[0].pf +
            reversedPay[0].esi +
            reversedPay[0].tds +
            reversedPay[0].lop +
            reversedPay[0].pt +
            reversedPay[0].SPL_Deduction +
            reversedPay[0].ewf +
            reversedPay[0].cd

          this.payRollForm.controls['payForm'].setValue({
            month: null,
            basic: reversedPay[0].basic,
            da: reversedPay[0].da,
            hra: reversedPay[0].hra,
            wa: reversedPay[0].wa,
            ca: reversedPay[0].ca,
            cca: reversedPay[0].cca,
            ma: reversedPay[0].ma,
            SalesIncentive: reversedPay[0].SalesIncentive,
            LeaveEncashment: reversedPay[0].LeaveEncashment,
            HolidayWages: reversedPay[0].HolidayWages,
            SpecialAllowance: reversedPay[0].SpecialAllowance,
            Bonus: reversedPay[0].Bonus,
            IndividualIncentive: reversedPay[0].IndividualIncentive,
            pf: reversedPay[0].pf,
            esi: reversedPay[0].esi,
            tds: reversedPay[0].tds,
            lop: reversedPay[0].lop,
            pt: reversedPay[0].pt,
            SPL_Deduction: reversedPay[0].SPL_Deduction,
            ewf: reversedPay[0].ewf,
            cd: reversedPay[0].cd,
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
    if (!this.payRollForm.valid) {
      this.toastMessageService.error(`Please fill all the required fields`);
      return;
    }
    event.totalDeductions = this.onGetTotalDeductions();
    event.totalEarnings = this.onGetTotalEarning();
    event.netPay = this.onGetTotalEarning() - this.onGetTotalDeductions();
    this.adminService.createPayroll(this.id, event).subscribe((res: any) => {
      this.toastMessageService.success(res['message']);
      this.router.navigate([`/admin/employees`]);
    }, err => {
      console.log(err);
      this.toastMessageService.error(err.error['message']);
    })
  }

  onDeleteEmp(id: Event) {
    document.body.style.setProperty('overflow', 'hidden', 'important');
    this.modalBackground.nativeElement.style.filter = 'blur(8px)';
    const dialogRef = this.dialog.open(DiscardChangesComponent, {
      width: '300px',
      scrollStrategy: new NoopScrollStrategy(),
      data: {confirmBtnText: 'Delete', cancelBtnText: 'Cancel', class:"danger", confirmationText: ' <b>You cannot undo this action!</b> <br> Are you sure you want to delete employee?', confirmParameter: 'deleteEmp' }
    });

    dialogRef.afterClosed().subscribe(result => {
      document.body.style.overflow = 'auto';
      this.modalBackground.nativeElement.style.filter = 'blur(0)';
      if (!result) {
        console.log('hey')
        return;
      }
      this.adminService.deleteEmp(id).subscribe((res:any) => {
        this.router.navigate(['admin/employees'])
      }, err => {
        console.log(err)
      })
    });

  
  }

  onCancelSubmitPayRollForm() {
    this.router.navigate([`/admin/employees`]);
  }

}
