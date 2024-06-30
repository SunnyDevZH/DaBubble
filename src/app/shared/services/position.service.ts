import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PositionService {
  private positionSource = new Subject<{ top: number, left: number }>();

  position$ = this.positionSource.asObservable();

  setPosition(top: number, left: number) {
    this.positionSource.next({ top, left });
  }
}
