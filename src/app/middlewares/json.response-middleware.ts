export class JsonOutput {
    data: any;
    message: string;
  
    constructor(data: any) {
      this.message = data.message;
      this.data = data.details || data || "Something went wrong";
    }
  }