export interface Order {
  id: integer;
  petId: integer;
  quantity: integer;
  shipDate: string;
  /**
   * @summary Order Status
   */
  status: string;
  complete: boolean;
}
