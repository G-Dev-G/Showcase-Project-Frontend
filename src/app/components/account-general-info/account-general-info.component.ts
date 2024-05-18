import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-account-general-info',
  templateUrl: './account-general-info.component.html',
  styleUrls: ['./account-general-info.component.scss']
})
export class AccountGeneralInfoComponent {
  public infoForm: FormGroup;
  public errorMsg = "";
  public successMsg = "";

  constructor(private formBuilder: FormBuilder, public authService: AuthenticationService) {
    this.infoForm = this.formBuilder.group({
      name: [this.authService.currentUser?.name != null ? this.authService.currentUser?.name : '', Validators.required],
      address: [this.authService.currentUser?.address != null ? this.authService.currentUser?.address : '']
    });
  }

  public async save(): Promise<void> {
    this.errorMsg = "";
    this.successMsg = "";
    // validate form before submit to backend
    if (this.infoForm.invalid)
      return;

    if (this.authService.currentUser != null) {
      const res = await this.authService.updateNameAndAddress(this.authService.currentUser?.userId, this.infoForm.get('name').value, this.infoForm.get('address').value);
      // fail to update
      if (res == null) {
        this.errorMsg = "Update failed."; // update prompt msg
      }
      // on success - update local UserDto
      else {
        this.successMsg = "Information has been successfully updated.";
        this.authService.currentUserSubject.next(res);
      }
    }
  }

  // attach Bootstrap class
  public getValidationClass(controlName: string): string {
    if (this.infoForm.get(controlName).invalid && this.infoForm.get(controlName).touched)
      return 'form-control is-invalid';
    return 'form-control';
  }
}
