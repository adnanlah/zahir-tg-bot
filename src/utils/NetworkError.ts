export class NetworkError extends Error {
  statusCode: number
  responseBody: any

  constructor(message: string, statusCode: number, responseBody: any) {
    super(message)
    this.name = 'NetworkError'
    this.statusCode = statusCode
    this.responseBody = responseBody
  }
}
