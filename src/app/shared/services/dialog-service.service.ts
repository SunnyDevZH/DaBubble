import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DirectMessageOverlayComponent} from '../../main-content/direct-message/direct-message-overlay/direct-message-overlay.component';
import {User} from '../../../models/user.class';

@Injectable({
  providedIn: 'root'
})
export class DialogServiceService {
  itemID: any = '';
  user: User = new User();


  constructor(private dialog: MatDialog) {}

  openDirectMessageDialog(userData: any, itemId: string) {
    console.log('Übergebene Daten:', userData);
    console.log(itemId);
    this.dialog.open(DirectMessageOverlayComponent, {
      minWidth: '398px',
      minHeight: '600px',
      panelClass: 'custom-dialog-container',
      // data: userData
      // data: { user: this.user,
      //   itemId: this.itemID }
      data: { user: userData, itemId: itemId }
    });
  }
}
