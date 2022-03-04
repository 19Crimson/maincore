export interface Response<T>{
  data: T,
  success: boolean,
  message: string,
  status: number
  headers?: object
  errors?: Record<string, string>
}
export type ApiResponse<T> = Promise<Response<T>>