import { Component, HostListener, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { fade, slideUp } from 'src/app/shared/common/animations/animations';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-apply-leaves',
  templateUrl: './apply-leaves.component.html',
  styleUrls: ['./apply-leaves.component.scss', '../../employe-profile/employe-profile.component.scss'],
  animations: [
    fade,
    slideUp
  ]
})
export class ApplyLeavesComponent implements OnInit {

  constructor(private userService: UserService, private router: Router) { }
  userForm!: FormGroup;
  isMobileDevice: boolean = false;
  isProvider: boolean = false;
  profileImageUrl: any =
    'https://g99plus.b-cdn.net/AEMR/assets/img/profileDefault.png';

  leavesReasons: any = [
    {
      name: 'Sick Leave',
    },
    {
      name: 'Urgent Work',
    },
    {
      name: 'Doctor',
    },
    {
      name: 'Other',
    },
  ]

  status: string = 'Pending';
  appliedLeaves: number;
  errorMessages: string;

  ngOnInit(): void {
    this.userForm = new FormGroup({
      reason: new FormControl('', [Validators.required]),
      from: new FormControl('', [Validators.required]),
      to: new FormControl('', [Validators.required])
    })
    this.onResize();
    // this.userService.getUserProfile().subscribe(
    //   (res: any) => {
    //     // this.userDetails = res['user'];
    //     // const firstname = this.userDetails['fullName'].toString().split(" ")[0].trim();
    //     // const lastNameArray = this.userDetails['fullName'].toString().split(" ").slice(1);
    //     // let lastName = '';
    //     // lastNameArray.map((n: string, i: number) => {
    //     //   lastName += (n) + ' '
    //     // })
    //     // this.userForm.patchValue({
    //     //   firstName: firstname,
    //     //   lastName: lastName.trim(),
    //     //   email: this.userDetails['email'],
    //     //   phone: this.userDetails['phone'],
    //     //   password: ''
    //     // })
    //   },
    //   err => {
    //     console.log(err);
    //   }
    // );
  }

  isDateValid() {
    let formData = this.userForm.value;
    if ((formData.to && formData.from) && (formData.to < formData.from)) {
      this.userForm.controls['to'].setErrors({ 'incorrect': true });
      this.userForm.controls['from'].setErrors({ 'incorrect': true });
    }
    else {
      this.userForm.controls['to'].setErrors(null);
      this.userForm.controls['from'].setErrors(null);
    }

  }



  submitForm() {
    this.errorMessages
    let formData = this.userForm.value;

    if ((formData.to && formData.from) && (formData.to < formData.from)) {
      this.userForm.controls['to'].setErrors({ 'incorrect': true });
      this.userForm.controls['from'].setErrors({ 'incorrect': true });
      return;
    }
    formData.status = this.status;
    try {
      this.userService.applyLeave(formData).subscribe((res) => {
        // this.showSucessMessage = true;
        this.router.navigate([`/employee/leaves/check`])
      },
        err => {
          console.log(err);
        })
    }
    catch {
      console.log('some error occured')
    }

  }




  fileChangeEvent(e: any) {
    console.log(e);
    // this.showModalForImage = true;
    // this.imageChangedEvent = e;
  }

  cancelImageUpload() {
    // this.showModalForImage = false;
    // this.myFileInput.nativeElement.value = '';
  }

  saveImage() {
    // if (this.userId && this.userId !== 0) {
    //   console.log('here');
    //   const formData = new FormData();
    //   formData.append(
    //     'file',
    //     this.convertImageService.base64ToFile(this.croppedImage)
    //   );
    //   this.userService
    //     .uploadImage(this.userId, formData)
    //     .then((response: any) => {
    //       this.profileImageUrl = response.profileImageUrl + '?t=' + new Date();
    //       this.showModalForImage = false;
    //       this.toastService.success('Image updated successfully!!');
    //     })
    //     .catch((e) => {
    //       console.log(e);
    //       this.toastService.error('Error while uploading image');
    //     });
    // }
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    if (window.innerWidth <= 768) {
      this.isMobileDevice = true;
    } else {
      this.isMobileDevice = false;
    }
  }

  get f() {
    return this.userForm.controls;
  }

  onCancelSubmit() {
    this.router.navigate(['/employee/leaves/check']);
  }
}
