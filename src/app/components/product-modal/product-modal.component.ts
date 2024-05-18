import { Byte } from '@angular/compiler/src/util';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from 'src/app/alert/alert.service';
import { ProductDto } from 'src/app/dtos/ProductDto';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-modal',
  templateUrl: './product-modal.component.html',
  styleUrls: ['./product-modal.component.scss']
})
export class ProductModalComponent implements OnInit {
  @Input() productDto: ProductDto;

  public addedImgsBytes: Array<Byte[]> = []; // image bytes to upload to DB
  public previewImgsToDisplay: Array<string> = []; // images on UI

  public productForm: FormGroup;
  public submitFlag = false; // check if submit button is clicked and output error

  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private productService: ProductService,
    private alertService: AlertService) { }

  ngOnInit(): void {
    this.productForm = this.formBuilder.group({
      shortName: [this.productDto == null ? '' : this.productDto.shortName, Validators.required],
      fullName: [this.productDto == null ? '' : this.productDto.fullName, Validators.required],
      description: [this.productDto == null ? '' : this.productDto.description, Validators.required],
      price: [this.productDto == null ? '' : this.productDto.price, Validators.required],
      category: [this.productDto == null ? '' : this.productDto.category, Validators.required]
    });

    // preload images - Update case
    if (this.productDto != null) {
      this.productDto.images.forEach(img => {
        this.addedImgsBytes.push(img); // push byte array
        // convert image retrieved from DB to displayable source
        const url = 'data:image/png;base64,' + img;
        this.previewImgsToDisplay.push(url); // display as base64
      });
    }
  }

  // validation - price maximum 2 decimal places
  public priceToPrecision($event): void {
    if ($event.target.value != '') {
      $event.target.value = parseFloat(parseFloat($event.target.value).toFixed(2));
      this.productForm.get('price').setValue($event.target.value);
    }
  }

  // Rread File as byte array
  private async fileToByteArray(file: File): Promise<Byte[]> {
    const reader = new FileReader();

    return new Promise((resolve) => {
      reader.readAsArrayBuffer(file); // read data
      reader.onload = () => {
        console.log((reader.result));
        const btyeArray = new Uint8Array((reader.result as ArrayBuffer));
        resolve(Array.from(btyeArray));
      };
    });
  };

  // Rread File as dataUrl
  private async fileToDataUrl(file: File): Promise<string> {
    const reader = new FileReader();

    return new Promise((resolve) => {
      reader.readAsDataURL(file); // read data
      reader.onload = () => {
        resolve(reader.result as string);
      };
    });
  };

  // File input change event
  public async addImgFile($event: Event): Promise<void> {
    const files = ($event.target as HTMLInputElement).files;

    for (let i = 0; i < files.length; i++) {
      // validate file type
      if (files.item(i).type.startsWith('image/')) {
        // read images as bytes to store in DB
        const imageBytes = await this.fileToByteArray(files.item(i));
        this.addedImgsBytes.push(imageBytes);
        // read images as dataUrl to display
        const imageUrl = await this.fileToDataUrl(files.item(i));
        this.previewImgsToDisplay.push(imageUrl);
      } else {
        // invalid
        await this.alertService.confirmPrompt("File is not supported.", 'OK', false, 'error');
      }
    }
    ($event.target as HTMLInputElement).value = ""; // reset value to make sure change event can be fired
  }

  // Remove image onClick
  public removeImgByIndex(index: number): void {
    this.addedImgsBytes.splice(index, 1);
    this.previewImgsToDisplay.splice(index, 1);
  }

  // Save
  public async saveProduct(): Promise<void> {
    this.submitFlag = true;

    // check if the product images and other values are valid
    if (this.addedImgsBytes.length > 0 && this.addedImgsBytes.length <= 5 && this.productForm.valid) {
      let productToSave = new ProductDto();
      if (this.productDto != null)
        productToSave = this.productDto; // case of update product

      productToSave.images = this.addedImgsBytes; // get images

      // get value of other properties
      productToSave.shortName = this.productForm.get('shortName').value;
      productToSave.fullName = this.productForm.get('fullName').value;
      productToSave.description = this.productForm.get('description').value;
      productToSave.price = this.productForm.get('price').value;
      productToSave.category = this.productForm.get('category').value;

      // Update call
      if (this.productDto != null) {
        await this.productService.updateProduct(productToSave);
        this.activeModal.close("UPDATED"); // success
      }
      // Create call
      else {
        await this.productService.addProduct(productToSave);
        this.activeModal.close('CREATED'); // success
      }
    }
  }
}
