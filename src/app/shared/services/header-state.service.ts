import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HeaderStateService {
  private _alternativeHeader = new BehaviorSubject<boolean>(false);
  alternativeHeader$ = this._alternativeHeader.asObservable();

  setAlternativeHeader(value: boolean) {
    // console.log('Setting alternativeHeader to', value);
    this._alternativeHeader.next(value);
  }
}
