import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ROLE_ADMIN, ROLE_USER } from 'src/app/dtos/UserDto';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-register',
  templateUrl: 'register.page.html',
  styleUrls: ['register.page.scss'],
})
export class RegisterPage {

  public registerForm: FormGroup;
  public registerResult = '';

  public codeSent = false; // button state toggle
  public sendCodeText = "Send Code";

  public registerAdmin = false;

  constructor(private authService: AuthenticationService, private formBuilder: FormBuilder) {
    this.registerForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: ['', Validators.compose([Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*\d).{8,}$/i)])], // RegEx for password
      userRole: [ROLE_USER, Validators.required],  // default as USER
      verificationCode: ['', Validators.required],
      adminRegisterCode: ['']
    });
  }

  public async register(): Promise<void> {
    this.registerForm.get('adminRegisterCode').updateValueAndValidity(); // udpate validity of admin field before submit
    this.registerResult = '';
    // to show possible error msg
    this.registerForm.get('name').markAsTouched();
    this.registerForm.get('email').markAsTouched();
    this.registerForm.get('password').markAsTouched();
    this.registerForm.get('userRole').markAsTouched();
    this.registerForm.get('verificationCode').markAsTouched();
    // admin input
    if (this.registerAdmin)
      this.registerForm.get('adminRegisterCode').markAsTouched();
    // form validation
    if (this.registerForm.valid) {
      // register
      this.registerResult = await this.authService.register(
        this.registerForm.get('name').value,
        this.registerForm.get('email').value,
        this.registerForm.get('password').value,
        this.registerForm.get('userRole').value,
        this.registerForm.get('verificationCode').value,
        this.registerForm.get('adminRegisterCode').value
      );
    }
  }

  /**
   * Send Verification Code
   */
  public async sendCode(): Promise<void> {
    // send code
    const res = await this.authService.sendEmailCodeToRegister(this.registerForm.get('email').value);
    if (res == 'success') {
      // success
      let resendCountdown = 60; // seconds until user could resend code
      // disable button and change text
      this.codeSent = true;
      this.sendCodeText = "Resend (" + resendCountdown + ")";
      // set countdown
      const timer = setInterval(() => {
        resendCountdown--;
        this.sendCodeText = "Resend (" + resendCountdown + ")";
        // revert change
        if (resendCountdown <= 0) {
          clearInterval(timer);
          this.sendCodeText = "Send Code";
          this.codeSent = false;
        }
      }, 1000);
    }
  }

  public registerAsAdmin(): void {
    this.registerAdmin = true;
    this.registerForm.get('userRole').setValue(ROLE_ADMIN);
    this.registerForm.get('adminRegisterCode').setValidators(Validators.required);
  }

  public registerAsUser(): void {
    this.registerAdmin = false;
    this.registerForm.get('adminRegisterCode').setValue('');
    this.registerForm.get('userRole').setValue(ROLE_USER);
    this.registerForm.get('adminRegisterCode').clearValidators();
  }

  public getValidationClass(controlName: string): string {
    if (this.registerForm.get(controlName).invalid && this.registerForm.get(controlName).touched)
      return 'form-control is-invalid';
    return 'form-control';
  }

}
