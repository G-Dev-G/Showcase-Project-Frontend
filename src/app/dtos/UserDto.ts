export const ROLE_USER = "USER";
export const ROLE_ADMIN = "ADMIN";

export class UserDto {
  public userId: number;
  public name: string;
  public usernameEmail: string;
  public address: string;
  public userRole: string; // USER/ADMIN

  constructor() {
    this.userId = null;
    this.name = null;
    this.usernameEmail = null;
    this.address = null;
    this.userRole = null;
  }
}
