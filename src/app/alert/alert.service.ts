import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal, { SweetAlertIcon } from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(private spinner: NgxSpinnerService) { }

  /**
   * Error Dialog for HTTP request
   * @param errorMsg
   */
  public async generateHttpError(errorMsg: string): Promise<void> {
    // hide potential existing loader to make sure dialog is clickable (because of z-index)
    this.spinner.hide();

    await Swal.fire({
      customClass: {
        container: 'swal-container'
      },
      title: '<h5>' + errorMsg + '</h5>',
      icon: 'error',
      confirmButtonText: 'Ok'
    })
  }

  /**
   * Confirmation Dialog
   * @param title
   * @param confirmText
   * @param showCancel
   * @param icon
   * @returns boolean
   */
  public async confirmPrompt(title: string, confirmText: string, showCancel: boolean, icon: SweetAlertIcon = 'info'): Promise<boolean> {
    const result = await Swal.fire({
      title: '<h5>' + title + '</h5>',
      icon: icon,
      showCancelButton: showCancel,
      showConfirmButton: true,
      confirmButtonText: confirmText
    });
    if (result) {
      if (result.isConfirmed)
        return true;
    }
    return false;
  }

  /**
   * Success Prompt
   * @param title
   */
  public async successPrompt(title: string): Promise<void> {
    await Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: '<h5>' + title + '</h5>',
      showConfirmButton: false,
      timer: 1000,
      width: '350px'
    })
  }

}
