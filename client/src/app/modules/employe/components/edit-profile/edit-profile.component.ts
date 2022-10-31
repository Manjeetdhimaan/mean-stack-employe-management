import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { fade, slideUp } from 'src/app/shared/common/animations/animations';
import { RegexEnum } from 'src/app/shared/common/constants/regex';
import { UserService } from '../../services/user.service';

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
  roles: any = [];
  clinicList: any = [];
  servicesList: any = [];
  serviceCategory: any = [];
  currenUserSubscription: any;

  userId: any = null;
  providerId: any = null;
  userData: any;
  username: any;
  loggedInUserRoles: any;
  businessId: any;
  isProvider: boolean = false;
  profileImageUrl: any =
    'https://g99plus.b-cdn.net/AEMR/assets/img/profileDefault.png';
  showModalForImage: boolean = false;
  isMobileDevice: boolean = false;

  // 
  userDetails:any;

  constructor(
    public formBuilder: FormBuilder,
    // private roleService: RolesService,
    private activatedRoute: ActivatedRoute,
    // private toastService: ToasTMessageService,
    private userService: UserService,
    // private localStorgaeService: LocalStorageService,
    // private authService: AuthService,
    // private convertImageService: ConvertImageService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.userForm = new FormGroup({
      firstName: new FormControl('', [Validators.required, Validators.pattern(RegexEnum.textFeild)]),
      email: new FormControl('', [Validators.required, Validators.pattern(RegexEnum.email)]),
      lastName: new FormControl('', [Validators.required, Validators.pattern(RegexEnum.textFeild)]),
      phone: new FormControl('', [Validators.required, Validators.pattern(RegexEnum.mobile)]),
      roleId: new FormControl(''),
      designation: new FormControl(''),
      description: new FormControl(''),
      clinicIds: new FormControl(''),
      serviceCategoryIds: new FormControl(''),
      serviceIds: new FormControl(''),
      isProvider: new FormControl(false),
    })
    this.onResize();
    

    this.userService.getUserProfile().subscribe(
      (res:any) => {
        this.userDetails = res['user'];
        const firstname = this.userDetails['fullname'].toString().split(" ")[0].trim();
        const lastNameArray = this.userDetails['fullname'].toString().split(" ").slice(1);
        let lastName = '';
        lastNameArray.map((n:string, i:number) => {
          lastName += (n)+' '
        })
        this.userForm.patchValue({
          firstName: firstname,
          lastName: lastName.trim(),
          email: this.userDetails['email'],
          phone: this.userDetails['phone'],
          password: ''
        })
      },
      err => {
        console.log(err);
      }
    );


    // this.initalizeUserForm();
  }

  initalizeUserForm() {
    this.userForm = this.formBuilder.group({
      firstName: [
        '',
        [Validators.required, Validators.pattern(RegexEnum.textFeild)]
      ],
      lastName: [
        '',
        [Validators.required, Validators.pattern(RegexEnum.textFeild)]
      ],
      email: ['', [Validators.required, Validators.pattern(RegexEnum.email)]],
      phone: ['', [Validators.required, Validators.pattern(RegexEnum.mobile)]],
      roleId: ['', [Validators.required]],
      designation: ['', []],
      timezone: ['', []],
      clinicIds: [[], []],
      serviceCategoryIds: [[], []],
      serviceIds: [[], []],
      isProvider: [false, []],
      description: ['', [Validators.maxLength(200)]]
    });
  }

  updateUserForm(response: any) {
    /* ----------------------------- laod all the id ---------------------------- */
    this.userData = response;
    const clinicIds = this.getIds(response.clinics);
    const serviceIds = this.getIds(response.services);
    const serviceCategoryIds = this.getIds(response.userServiceCategories);
    console.log(this.userForm.value, clinicIds, serviceIds, serviceCategoryIds);
    /* -------------------------- call the method by id ------------------------- */
    console.log(
      'clinicIds',
      clinicIds,
      'serviceCategoryIds',
      serviceCategoryIds
    );
    if (response?.isProvider && clinicIds && clinicIds.length > 0) {
      this.loadClinicCategoryService(clinicIds);
    }
    if (
      response?.isProvider &&
      serviceCategoryIds &&
      serviceCategoryIds.length > 0
    ) {
      this.loadServiceByCategory(serviceCategoryIds);
    }
    /* ---------------------------- patch form start ---------------------------- */
    this.userForm.patchValue({
      firstName: response?.firstName,
      lastName: response?.lastName,
      email: response?.email,
      phone: response?.phone,
      roleId: response?.roles.id,
      designation: response?.designation,
      timezone: response?.timezone,
      serviceCategoryIds: serviceCategoryIds,
      serviceIds: serviceIds,
      clinicIds: clinicIds,
      isProvider: response?.isProvider,
      description: response?.description
    });

    this.isProvider = response?.isProvider;
  }

  loadUser() {
    // this.userService
    //   .getOptimziedUser(this.userId)
    //   .then((response: any) => {
    //     this.userData = response;
    //     this.username = response.email;
    //     // this.clinicList = response.clinics;
    //     // this.servicesList = response.services;
    //     // this.serviceCategory = response.userServiceCategories;
    //     if (response.roles.length > 0) {
    //       this.loggedInUserRoles = response.roles.name;
    //     }
    //     this.profileImageUrl =
    //       response?.profileImageUrl ??
    //       'https://g99plus.b-cdn.net/AEMR/assets/img/profileDefault.png';
    //     this.updateUserForm(response);
    //   })
    //   .catch(() => {
    //     this.toastService.error('Unable to load User !!');
    //   });
  }

  loadClinics() {
    // this.userService.getClinics().then(
    //   (response: any) => {
    //     this.clinicList = response;
    //   },
    //   () => {
    //     this.toastService.error('Unable to load clinics.');
    //   }
    // );
  }

  loadClinicCategoryService(clinicIds?: any) {
    // this.userService
    //   .getOptimizedClinicServiceCategories(clinicIds)
    //   .then((response: any) => {
    //     this.serviceCategory = response;
    //   })
    //   .catch(() => {
    //     this.toastService.error(
    //       'Unable to load service category for selected clinic.'
    //     );
    //   });
  }

  loadServiceByCategory(ids: any) {
    // this.userService
    //   .getOptimizedCategoriesServices(ids)
    //   .then((response: any) => {
    //     this.servicesList = response;
    //   })
    //   .catch(() => {
    //     this.toastService.error(
    //       'Unable to load service  for selected clinic and category.'
    //     );
    //   });
  }

  getIds(item: any) {
    return item.map((data: any) => data.id);
  }

  toggleProvider(e: any) {
    console.log(e);
    if (e.checked) {
      this.isProvider = true;
    } else {
      this.isProvider = false;
    }
  }
  submitForm() {
    console.log(this.userForm.value);
    const formData = this.userForm.value;
    formData.roleId = Number(this.userForm.value.roleId);
    if (!this.providerId) {
      formData.clinicIds = null;
      formData.serviceIds = null;
      formData.serviceCategoryId = 0;
      formData.serviceCategoryIds = null;
    }

    if (this.userId) {
      this.updateUser(formData);
    } else {
      // this.createUser(formData);
    }
  }

  updateUser(formData: any) {
    // this.userService.updateUser(this.userId, formData).then(
    //   () => {
    //     this.toastService.success('User updated successfully.');
    //   },
    //   () => {
    //     this.toastService.error('Unable to save the user.');
    //   }
    // );
  }

  loadRoles() {
    // this.roleService.getOptimizedRoles().then(
    //   (response: any) => {
    //     var roles1 = [];
    //     for (var i = 0; i < response.length; i++) {
    //       if (response[i].name != 'Patient') {
    //         roles1.push(response[i]);
    //       }
    //     }
    //     this.roles = roles1;
    //     // this.roles = response;
    //   },
    //   () => {
    //     this.toastService.error('Unable to load the roles.');
    //   }
    // );
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

  imageCropped(event: any) {
    this.croppedImage = event.base64;
  }
  // imageCropped(event: ImageCroppedEvent) {
  //   this.croppedImage = event.base64;
  // }
  imageLoaded() {
    // show cropper
  }
  cropperReady() {
    // cropper ready
  }
  loadImageFailed() {
    // show message
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    if (window.innerWidth <= 768) {
      console.log(window.innerWidth);
      this.isMobileDevice = true;
    } else {
      this.isMobileDevice = false;
    }
  }
  get f() {
    return this.userForm.controls;
  }

  onCancelSubmit() {
    this.router.navigate(['/users']);
  }
}

