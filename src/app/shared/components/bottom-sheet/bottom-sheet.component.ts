import {Component, Inject, inject, Injectable} from '@angular/core';
import {MatNavList} from '@angular/material/list';
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheetModule, MatBottomSheetRef} from '@angular/material/bottom-sheet';
import {MatListModule} from '@angular/material/list';
import {MatButtonModule} from '@angular/material/button';
import {MatLine} from '@angular/material/core';
import {MatIcon} from '@angular/material/icon';
import {ProfilCardComponent} from '../../../main-content/profile/profil-card/profil-card.component';
import {MatDialog} from '@angular/material/dialog';
import {AuthService} from '../../services/auth.service';
import {User} from '../../../../models/user.class';

@Component({
  selector: 'app-bottom-sheet',
  standalone: true,
  imports: [
    MatNavList,
    MatBottomSheetModule,
    MatListModule,
    MatButtonModule,
    MatLine,
    MatIcon
  ],
  templateUrl: './bottom-sheet.component.html',
  styleUrl: './bottom-sheet.component.scss'
})

export class BottomSheetComponent {
  authService = inject(AuthService);
  user: User = new User();
  constructor(private _bottomSheetRef: MatBottomSheetRef<BottomSheetComponent>,
              private dialog: MatDialog,
              @Inject(MAT_BOTTOM_SHEET_DATA) public data: { user: User }) {}

  openProfileCard(): void {
    const dialogRef = this.dialog.open(ProfilCardComponent, {
      minWidth: '398px',
      minHeight: '600px',
      panelClass: 'custom-dialog-container',
      data: { user: this.data.user }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Der Dialog wurde geschlossen');
    });
  }

  logout(){
    this._bottomSheetRef.dismiss();
    this.authService.logout();
  }


  // openLink(event: MouseEvent): void {
  //   this._bottomSheetRef.dismiss();
  //   event.preventDefault();
  // }
}
