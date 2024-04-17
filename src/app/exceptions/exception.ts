export class HttpException {
    message: string;
    details: any;
    statusCode: number;
  
    constructor(errorCode: number, details: any) {
      this.details = details;
      this.message = details[0].msg || "Current operation failed";
      this.statusCode = errorCode;
    }
  }