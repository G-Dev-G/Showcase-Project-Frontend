import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatHorizontalStepper } from '@angular/material/stepper';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthenticationService } from 'src/app/services/authentication.service';


@Component({
  selector: 'app-forgot-password-modal',
  templateUrl: './forgot-password-modal.component.html',
  styleUrls: ['./forgot-password-modal.component.scss']
})
export class ForgotPasswordModalComponent implements OnInit {
  @ViewChild("stepper") stepper: MatHorizontalStepper;

  public resetPasswordForm: FormGroup;
  public codeSent = false; // button state toggle
  public sendCodeText = "Send Code";
  public showErrorMsg = false;
  public errorMsg = "";

  constructor(public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private authService: AuthenticationService) {
  }

  ngOnInit(): void {
    this.resetPasswordForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      verificationCode: ['', Validators.required],
      newPassword: ['', Validators.compose([Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*\d).{8,}$/i)])], // RegEx for password
    });
  }

  /**
   * Send Verification Code
   */
  public async sendCode(): Promise<void> {
    this.showErrorMsg = false;
    // send code
    const res = await this.authService.sendEmailCodeToResetPassword(this.resetPasswordForm.get('email').value);
    if (res == 'user not existed') {
      this.showErrorMsg = true;
      this.errorMsg = "Email is not found.";
    }
    else if (res == 'success') {
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

  /**
   * Verify Code, reset password, and process
   */
  public async validateCodeAndResetPassword(): Promise<void> {
    // validate the form first
    if (this.resetPasswordForm.invalid)
      return;
    this.showErrorMsg = false;
    // verify user and udpate password
    const res = await this.authService.resetPasswordByEmailCode(
      this.resetPasswordForm.get('email').value,
      this.resetPasswordForm.get('verificationCode').value,
      this.resetPasswordForm.get('newPassword').value
    );

    if (res != "success") {
      // stay on the step and show error msg
      this.showErrorMsg = true;
      if (res == "user not existed")
        this.errorMsg = "Email is not found.";
      else
        this.errorMsg = "Verification code is invalid.";
    }
    else {
      // enable going to next step if valid
      this.stepper.selected.completed = true;
      this.stepper.next();
    }
  }
}
