export interface Pet {
  id: integer;
  category: object;
  name: string;
  photoUrls: array;
  tags: array;
  /**
   * @summary pet status in the store
   */
  status: string;
}
