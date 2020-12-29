export interface User {
  id: integer;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  /**
   * @summary User Status
   */
  userStatus: integer;
}
