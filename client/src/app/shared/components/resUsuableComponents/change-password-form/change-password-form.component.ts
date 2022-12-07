import { ChangeDetectionStrategy, Component, forwardRef, HostListener, OnDestroy, OnInit } from '@angular/core';
import { ControlValueAccessor, FormBuilder, FormControl, FormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { fade, slideUp } from 'src/app/shared/common/animations/animations';
import { matchingInputsValidator } from './validators';

export interface PasswordFormValues {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

@Component({
  selector: 'app-change-password-form',
  templateUrl: './change-password-form.component.html',
  styleUrls: ['./change-password-form.component.scss'],
  animations: [
    fade,
    slideUp
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ChangePasswordFormComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => ChangePasswordFormComponent),
      multi: true,
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ChangePasswordFormComponent implements OnInit , ControlValueAccessor, OnDestroy{
  @HostListener('window:resize', ['$event'])
  onResize() {
    if (window.innerWidth <= 768) {
      this.isMobileDevice = true;
    } else {
      this.isMobileDevice = false;
    }
  }

  form: FormGroup;
  subscriptions: Subscription[] = [];

  get value(): PasswordFormValues {
    return this.form.value;
  }

  set value(value: PasswordFormValues) {
    this.form.setValue(value);
    this.onChange(value);
    this.onTouched();
  }

  

  constructor(private formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', Validators.required],
      confirmNewPassword: ['', Validators.required],
    }, { validator: matchingInputsValidator('newPassword', 'confirmNewPassword') });

    this.subscriptions.push(
      this.form.valueChanges.subscribe(value => {
        this.onChange(value);
        this.onTouched();
      })
    );
   }
  isMobileDevice: boolean = false;


  ngOnInit(): void {
   
  }
  

  get newPasswordControl() {
    console.log(this.form.controls['newPassword'].value)
    return this.form.controls['newPassword'].value;
  }

  get confirmNewPasswordControl() {
    console.log(this.form.hasError('missmatch'));
    return this.form.controls['confirmNewPassword'].value;
  }

  get f() {
    return this.form.controls;
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  onChange: any = () => {};
  onTouched: any = () => {};

  registerOnChange(fn:any) {
    this.onChange = fn;
  }

  writeValue(value:any) {
    if (value) {
      this.value = value;
    }

    if (value === null) {
      this.form.reset();
    }
  }

  registerOnTouched(fn:any) {
    this.onTouched = fn;
  }

  validate(_: FormControl) {
    return this.form.valid ? null : { passwords: { valid: false, }, };
  }

  reset() {
    this.form.reset();
  }

}
