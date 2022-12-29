import { Component, HostListener, OnInit, ViewChild, Inject, Injector } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { fade, slideUp } from 'src/app/shared/common/animations/animations';
import { RegexEnum } from 'src/app/shared/common/constants/regex';
import { ConvertImageService } from 'src/app/shared/services/image-utils/convertImage.service';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { environment } from 'src/environments/environment';
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

  canvasRotation = 0;
  rotation = 0;
  scale = 1;
  showCropper = false;
  containWithinAspectRatio = false;
  transform: any = {};

  @HostListener('window:resize', ['$event'])
  onResize() {
    if (window.innerWidth <= 768) {
      this.isMobileDevice = true;
    } else {
      this.isMobileDevice = false;
    }
  }


  constructor(
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private convertImageService: ConvertImageService,
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
      bio: new FormControl(''),
      // image: new FormControl('', {asyncValidators: mimeType})
    });
    this.onResize();
    this.userService.getUserProfile().subscribe(
      (res: any) => {
        this.userDetails = res['user'];
        this.userService.currentUserImgUrl.next({ name: this.userDetails['fullName'], imagePath: this.userDetails['imagePath'] });
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

  uploadImage(event: string) {
    if (event.toLowerCase() === 'upload') {
      let file: Blob = this.convertImageService.base64ToFile(this.croppedImage);
      Object.defineProperty(file, 'domain', {
        value: environment.domain,
        writable: false
      });
      // this.userForm.patchValue({ image: file });
      // this.userForm.get("image")?.updateValueAndValidity();
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
        // this.userForm.controls["image"].markAsDirty();
      };
      reader.readAsDataURL(file);
      const imageData = file;
    
      try {
        this.userService.updateProfileImage(imageData).subscribe((res: any) => {
          this.toastMessageService.success(res['msg']);
          this.showModalForImage = false;
          this.userService.currentUserImgUrl.next({ name: this.userDetails['fullName'], imagePath: res['imagePath'] });
        },
          err => {
            console.log(err);
          })
      }
      catch {
        console.log('An error occured');
      }

    }
    else {
      this.imagePreview = ""
      this.showModalForImage = false;
      const imageData = '';
      try {
        this.userService.removeProfileImage(imageData).subscribe((res: any) => {
          // this.showSucessMessage = true;
          this.toastMessageService.success(res['msg']);
          this.userService.currentUserImgUrl.next({ name: this.userDetails['fullName'], imagePath: res['imagePath'] });
          this.showModalForImage = false;
        },
          err => {
            console.log(err);
          })
      }
      catch {
        console.log('An error occured');
      }

    }
  }

  onImagePicked(event: Event) {
    const file: any = (event.target as HTMLInputElement).files?.[0];
    this.userForm.patchValue({ image: file });
    this.userForm.get("image")?.updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
      this.userForm.controls["image"].markAsDirty();
    };
    reader.readAsDataURL(file);
  }

  get f() {
    return this.userForm.controls;
  }

  onCancelSubmit() {
    this.router.navigate(['/employee/profile']);
  }

  fileChangeEvent(e: any) {
    this.showModalForImage = true;
    this.imageChangedEvent = e
  }

  cancelImageUpload() {
    this.showModalForImage = false;
    this.myFileInput.nativeElement.value = '';
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }
  imageLoaded() {
    // show cropper
  }
  cropperReady() {
    // cropper ready
  }
  loadImageFailed() {
    // show message
  }
}
