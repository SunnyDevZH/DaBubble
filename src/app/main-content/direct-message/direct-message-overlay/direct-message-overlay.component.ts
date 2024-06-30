import { Component, inject, Inject, OnInit } from '@angular/core';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardImage,
} from '@angular/material/card';
import { NgOptimizedImage } from '@angular/common';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { EditProfilCardComponent } from '../../profile/edit-profil-card/edit-profil-card.component';
import { MatButton } from '@angular/material/button';
import { User } from '../../../../models/user.class';
import { OnlineStatusPipe } from '../../../shared/pipes/online-status.pipe';
import { AuthService } from '../../../shared/services/auth.service';
import { FirestoreService } from '../../../shared/services/firestore.service';
import { ItemStateService } from '../../../shared/services/item-state.service';

@Component({
  selector: 'app-direct-message-overlay',
  standalone: true,
  imports: [
    MatCard,
    MatCardContent,
    MatCardImage,
    NgOptimizedImage,
    MatCardActions,
    MatButton,
    OnlineStatusPipe,
  ],
  templateUrl: './direct-message-overlay.component.html',
  styleUrl: './direct-message-overlay.component.scss',
})
export class DirectMessageOverlayComponent implements OnInit {
  user: User = new User();
  authService = inject(AuthService);
  firestore = inject(FirestoreService);
  itemId: string | null = '';

  constructor(
    public dialogRef: MatDialogRef<DirectMessageOverlayComponent>,
    public dialog: MatDialog,
    private itemStateService: ItemStateService,
    @Inject(MAT_DIALOG_DATA) public data: { user: User; itemId: string }
  ) {}

  ngOnInit() {
    if (this.data && this.data.itemId) {
      this.itemId = this.data.itemId;
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  closeDirectMessageOverlay() {
    this.dialogRef.close();
  }

  openEditProfileCard(): void {
    const dialogRef = this.dialog.open(EditProfilCardComponent, {
      minWidth: '398px',
      minHeight: '600px',
      panelClass: 'custom-dialog-container',
      data: { user: this.data.user },
    });
  }
}
