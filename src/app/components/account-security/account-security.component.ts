import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { UserDto } from 'src/app/dtos/UserDto';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ForgotPasswordModalComponent } from '../forgot-password-modal/forgot-password-modal.component';

// custom validator definition
const confirmPasswordValidator: ValidatorFn = (control: AbstractControl) => {
  const passwordToConfirm = control.parent.get('newPassword'); // get control from FormGroup
  const isMatched = control.value == passwordToConfirm.value;
  return isMatched ? null : { notMatched: true }; // return valid if is matched
}

@Component({
  selector: 'app-account-security',
  templateUrl: './account-security.component.html',
  styleUrls: ['./account-security.component.scss']
})
export class AccountSecurityComponent {
  public passwordForm: FormGroup;
  public errorMsg = "";
  public successMsg = "";

  constructor(private formBuilder: FormBuilder, public authService: AuthenticationService, private modalService: NgbModal) {
    this.passwordForm = this.formBuilder.group({
      currentPassword: ["", Validators.required],
      newPassword: ["", Validators.compose([Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*\d).{8,}$/i)])], // password validator
      confirmPassword: ["", Validators.required]
    });

    // re-set validator after form is initialized
    this.passwordForm.get('confirmPassword').setValidators(Validators.compose([Validators.required, confirmPasswordValidator]));
    // subscribe to the value change of new password to make validator take effect without manually touching confirmPassword again
    this.passwordForm.get('newPassword').valueChanges.subscribe(() => {
      this.passwordForm.get('confirmPassword').updateValueAndValidity();
    })
  }

  public async save(): Promise<void> {
    this.errorMsg = "";
    this.successMsg = "";

    if (this.passwordForm.invalid)
      return;

    const res = await this.authService.updatePassword(
      this.authService.currentUser?.userId,
      this.passwordForm.get('currentPassword').value,
      this.passwordForm.get('newPassword').value
    );
    // fail to update - matched response string
    if (res['passwordCorrect'] == false) {
      // update prompt msg
      this.errorMsg = "Update failed - Current password is incorrect.";
    }
    // on success - update local UserDto
    if (res['userDto'] != null) {
      this.successMsg = "Password has been successfully updated.";
      this.authService.currentUserSubject.next(res['userDto'] as UserDto);
    }
  }

  // forgot password modal
  public openForgotPasswordModal(): void {
    // open modal
    const modalOptions: NgbModalOptions = {
      size: 'lg'
    };
    this.modalService.open(ForgotPasswordModalComponent, modalOptions);
  }

  // attach Bootstrap class
  public getValidationClass(controlName: string): string {
    if (this.passwordForm.get(controlName).invalid && this.passwordForm.get(controlName).touched)
      return 'form-control is-invalid';
    return 'form-control';
  }

}
