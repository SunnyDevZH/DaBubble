import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MemberService {
  private members = new BehaviorSubject<any[]>([]);

  setMembers(members: any[]) {
    this.members.next(members);
  }

  getMembers() {
    return this.members.asObservable();
  }

  updateMemberAvatar(uid: string, newAvatarUrl: string) {
    const members = this.members.getValue();
    const member = members.find(member => member.uid === uid);
    if (member) {
      member.avatar = newAvatarUrl;
    }
    this.setMembers(members);
  }
}