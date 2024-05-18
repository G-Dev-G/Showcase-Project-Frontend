import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ForgotPasswordModalComponent } from 'src/app/components/forgot-password-modal/forgot-password-modal.component';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: 'login.page.html',
  styleUrls: ['login.page.scss'],
})
export class LoginPage {

  public loginForm: FormGroup;
  // show error flag
  public accountNotFound = false;

  constructor(private authService: AuthenticationService, private formBuilder: FormBuilder, private modalService: NgbModal) {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: ['', Validators.required]
    });
  }

  public async login(): Promise<void> {
    this.accountNotFound = false;
    // to show possible input error msg
    this.loginForm.get('email').markAsTouched();
    this.loginForm.get('password').markAsTouched();
    // form validation
    if (this.loginForm.valid) {
      // login validation
      let msg = await this.authService.login(this.loginForm.get('email').value, this.loginForm.get('password').value);
      if (msg === "failed")
        this.accountNotFound = true;
    }
  }

  public openForgotPasswordModal(): void {
    // open modal
    const modalOptions: NgbModalOptions = {
      size: 'lg'
    };
    this.modalService.open(ForgotPasswordModalComponent, modalOptions);
  }

  public getValidationClass(controlName: string): string {
    if (this.loginForm.get(controlName).invalid && this.loginForm.get(controlName).touched)
      return 'form-control is-invalid';
    return 'form-control';
  }

}
