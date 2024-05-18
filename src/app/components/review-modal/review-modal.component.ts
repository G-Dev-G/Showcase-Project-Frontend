import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { OrderDto } from 'src/app/dtos/OrderDto';
import { ReviewDto } from 'src/app/dtos/ReviewDto';
import { ReviewService } from 'src/app/services/review.service';

@Component({
  selector: 'app-review-modal',
  templateUrl: './review-modal.component.html',
  styleUrls: ['./review-modal.component.scss']
})
export class ReviewModalComponent implements OnInit {
  @Input() orderDto: OrderDto;

  public reviewForm: FormGroup;
  public hasReview = false; // check which button to display on UI

  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private reviewService: ReviewService
  ) { }

  ngOnInit(): void {
    this.reviewForm = this.formBuilder.group({});

    // dynamically add form controls for each order item
    for (let i = 0; i < this.orderDto.orderItemDtoList.length; i++) {
      if (this.orderDto.orderItemDtoList[i].reviewDto == null) {
        this.reviewForm.addControl('rating' + i, new FormControl(null, Validators.required));
        this.reviewForm.addControl('comment' + i, new FormControl(null, Validators.required));
      }
      // if review exists, put content in
      else {
        this.hasReview = true; // toggle the state
        this.reviewForm.addControl('rating' + i, new FormControl(this.orderDto.orderItemDtoList[i].reviewDto?.rating, Validators.required));
        this.reviewForm.addControl('comment' + i, new FormControl(this.orderDto.orderItemDtoList[i].reviewDto?.comment, Validators.required));
      }
    }
  }

  // Check the condition that one review must have rating attached
  hasValidRatingControl() {
    let hasRating = false;
    for (let i = 0; i < this.orderDto.orderItemDtoList.length; i++) {
      // check if comment control has value while rating does not
      if (this.reviewForm.get('comment' + i).valid) {
        if (this.reviewForm.get('rating' + i).invalid)
          return false;
      }
      // check if any rating control is valid
      if (this.reviewForm.get('rating' + i).valid)
        hasRating = true;
    }
    return hasRating;
  }

  // add or update review for each order item
  public async setReview(): Promise<void> {
    for (let i = 0; i < this.orderDto.orderItemDtoList.length; i++) {
      // add review if the rating is selected
      if (this.reviewForm.get('rating' + i).valid) {
        const reviewToSet = new ReviewDto();
        reviewToSet.orderItemId = this.orderDto.orderItemDtoList[i].orderItemId;
        reviewToSet.rating = this.reviewForm.get('rating' + i).value as number;
        reviewToSet.comment = this.reviewForm.get('comment' + i).value;
        reviewToSet.reviewDate = new Date(); // set date as today
        await this.reviewService.setReview(reviewToSet); // persist data
      }
    }
     this.activeModal.close('SET');
  }
}
