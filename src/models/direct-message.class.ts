export class DirectMessage {
  id?: string;
  sender: string;
  recipient: string;  

  constructor(obj?: any) {
    this.sender = obj ? obj.sender : '';
    this.recipient = obj ? obj.recipient : '';    
  }

  public toJSON() {
    return {
      sender: this.sender,
      recipient: this.recipient,
    };
  }
}
