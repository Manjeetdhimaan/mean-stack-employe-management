import { Component, HostListener, OnInit, ViewChild, Inject, Injector } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { fade, slideUp } from 'src/app/shared/common/animations/animations';
import { RegexEnum } from 'src/app/shared/common/constants/regex';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { UserService } from '../../services/user.service';
import { mimeType } from './mime-type.validator';



@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss'],
  animations: [
    fade,
    slideUp
  ]
})
export class EditProfileComponent implements OnInit {
  activatedRouteUserId: any = null;
  @ViewChild('myFileInput') myFileInput: any;
  isImageUploading: boolean = false;
  imageChangedEvent: any = '';
  croppedImage: any = '';
  userForm!: FormGroup;
  // roles: any = [];
  // clinicList: any = [];
  // servicesList: any = [];
  // serviceCategory: any = [];
  // currenUserSubscription: any;

  // userId: any = null;
  // providerId: any = null;
  // userData: any;
  // username: any;
  // loggedInUserRoles: any;
  // businessId: any;
  isProvider: boolean = false;
  profileImageUrl: any =
    'assets/img/profileDefault.png';
  showModalForImage: boolean = false;
  isMobileDevice: boolean = false;

  // 
  userDetails: any;
  imagePreview: string;


  constructor(
    // private roleService: RolesService,
    private activatedRoute: ActivatedRoute,
    // private toastService: ToasTMessageService,
    private userService: UserService,
    // private localStorgaeService: LocalStorageService,
    // private authService: AuthService,
    // private convertImageService: ConvertImageService,
    private router: Router, @Inject(Injector) private readonly injector: Injector) { }


    private get toastMessageService() {
      return this.injector.get(ToasTMessageService);
  }
  ngOnInit(): void {
    this.userForm = new FormGroup({
      fullName: new FormControl('', [Validators.required, Validators.pattern(RegexEnum.textFeild)]),
      service: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.pattern(RegexEnum.email)]),
      phone: new FormControl('', [Validators.required, Validators.pattern(RegexEnum.mobile)]),
      // roleId: new FormControl(''),
      // designation: new FormControl(''),
      bio: new FormControl(''),
      image: new FormControl(null)
      
    })
    this.onResize();

    this.userService.getUserProfile().subscribe(
      (res: any) => {
        this.userDetails = res['user'];
        this.userService.currentUserImgUrl.next({name: this.userDetails['fullName'], imagePath: this.userDetails['imagePath']});
        this.userForm.patchValue({
          fullName: this.userDetails['fullName'],
          service: this.userDetails['service'],
          email: this.userDetails['email'],
          phone: this.userDetails['phone'],
          bio: this.userDetails['bio'],
          image: this.userDetails['imagePath']
        })
        this.imagePreview = this.userDetails['imagePath'];
      },
      err => {
        console.log(err);
      }
    );
  }


  submitForm() {
    if (!this.userForm.valid) {
      return
    }
    const formData = this.userForm.value;
    try {
      this.userService.updateUserProfile(formData).subscribe((res: any) => {
        // this.showSucessMessage = true;
        this.toastMessageService.success(res['msg']);
        this.router.navigate([`/employee/profile`]);
      },
        err => {
          console.log(err);
        })
    }
    catch {
      console.log('An error occured');
    }
  }

  removeImagePath() {
    console.log(this.imagePreview)
    if (!this.userForm.valid) {
      return
    }
    let formData = this.userForm.value;
    formData.image = ""
    console.log(formData)
    try {
      this.userService.updateUserProfile(formData).subscribe((res: any) => {
        // this.showSucessMessage = true;
        this.toastMessageService.success(res['msg']);
        this.router.navigate([`/employee/profile`]);
      },
        err => {
          console.log(err);
        })
    }
    catch {
      console.log('An error occured');
    }
  }

  fileChangeEvent(e: any) {
    console.log(e);
    this.showModalForImage = true;
    this.imageChangedEvent = e;
  }

  cancelImageUpload() {
    this.showModalForImage = false;
    this.myFileInput.nativeElement.value = '';
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

  onImagePicked(event: Event) {
    const file:any = (event.target as HTMLInputElement).files?.[0];
    this.userForm.patchValue({ image: file });
    this.userForm.get("image")?.updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
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
    this.router.navigate(['/employee/profile']);
  }
}
