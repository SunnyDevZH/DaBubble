export class Channel {
  id?: string;
  creator: string;
  description: string;
  member: any[];
  name: string;

  constructor(obj?: any) {
    this.creator = obj ? obj.creator : '';
    this.description = obj ? obj.description : '';
    this.member = obj && obj.member ? obj.member : [];
    this.name = obj ? obj.name : '';
  }

  public toJSON() {
    return {
      creator: this.creator,
      description: this.description,
      member: this.member,
      name: this.name,
    };
  }
}
