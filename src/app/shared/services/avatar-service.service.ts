import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AvatarService {
  private avatarChangeSource = new Subject<string>();
  avatarChange$ = this.avatarChangeSource.asObservable();

  avatarChanged(newAvatarUrl: string) {
    this.avatarChangeSource.next(newAvatarUrl);
  }
}