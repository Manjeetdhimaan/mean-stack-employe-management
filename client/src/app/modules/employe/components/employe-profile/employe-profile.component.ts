import { Component, Input, OnInit } from '@angular/core';
import { fade, slideUp } from 'src/app/shared/common/animations/animations';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-employe-profile',
  templateUrl: './employe-profile.component.html',
  styleUrls: ['./employe-profile.component.scss'],
  animations: [
    fade,
    slideUp
  ]
})
export class EmployeProfileComponent implements OnInit {

  constructor(private userService: UserService, ) { }

  userDetails:any;
  firstName:string;
  lastName:string;
  profileImageUrl: any =
    'https://g99plus.b-cdn.net/AEMR/assets/img/profileDefault.png';

    attendance:any[]

  ngOnInit(): void {
    this.userService.getUserProfile().subscribe(
      (res:any) => {
        this.userDetails = res['user'];
        this.attendance = this.userDetails.attendance.reverse();
        this.firstName = this.userDetails['fullname'].toString().split(" ")[0].trim();
        const lastNameArray = this.userDetails['fullname'].toString().split(" ").slice(1);
        this.lastName = '';
        lastNameArray.map((n:string, i:number) => {
          this.lastName += (n)+' '
        })
      },
      err => {
        console.log(err);
      }
    );

  }

}
