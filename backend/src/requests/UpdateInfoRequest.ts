/**
 * Fields in a request to update a single INFO item.
 */
export interface UpdateInfoRequest {
  name: string
  dueDate: string
  done: boolean
}