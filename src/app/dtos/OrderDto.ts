import { OrderItemDto } from "./OrderItemDto";
import { UserDto } from "./UserDto";

// Default status
export const PENDING_STATUS = "PENDING";
// ADMIN operation
export const CONFIRMED_STATUS = "CONFIRMED";
export const CANCELLED_STATUS = "CANCELLED";
// USER operation
export const COMPLETED_STATUS = "COMPLETED";
export const RETURNED_STATUS = "RETURNED";

export class OrderDto {
  public orderId: number;
  public userDto: UserDto;
  public orderDate: Date;
  public userFullName: string;
  public address: string;
  public status: string;
  public statusCheckedByUserLastTime: string;
  public statusCheckedByAdminLastTime: string;
  public orderItemDtoList: Array<OrderItemDto>;

  constructor() {
    this.orderId = null;
    this.userDto = null;
    this.orderDate = null;
    this.userFullName = null;
    this.address = null;
    this.status = null;
    this.statusCheckedByUserLastTime = null;
    this.statusCheckedByAdminLastTime = null;
    this.orderItemDtoList = [];
  }
}
