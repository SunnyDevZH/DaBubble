import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ItemStateService {
  private itemIdSource = new BehaviorSubject<string | null>(null);
  itemId$ = this.itemIdSource.asObservable();

  constructor() { }

  setItemId(id: string) {
    this.itemIdSource.next(id);
  }

  clearItemId() {
    this.itemIdSource.next(null);
  }
}
