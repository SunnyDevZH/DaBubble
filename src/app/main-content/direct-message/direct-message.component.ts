import {
  Component,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { DirectMessageOverlayComponent } from './direct-message-overlay/direct-message-overlay.component';
import { MatDialog } from '@angular/material/dialog';
import { NavigationService } from '../../shared/services/navigation.service';
import { BottomSheetComponent } from '../../shared/components/bottom-sheet/bottom-sheet.component';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { FirestoreService } from '../../shared/services/firestore.service';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../../models/user.class';
import { AuthService } from '../../shared/services/auth.service';
import { HeaderMobileComponent } from '../../shared/components/header-mobile/header-mobile.component';
import { HeaderStateService } from '../../shared/services/header-state.service';
import { TextBoxComponent } from '../../shared/components/text-box/text-box.component';
import { ConversationComponent } from '../../shared/components/conversation/conversation.component';
import { Channel } from '../../../models/channel.class';
import { DateFormatService } from '../../shared/services/date-format.service';
import { TimeSeperatorComponent } from '../../shared/components/time-seperator/time-seperator.component';
import { MatchMediaService } from '../../shared/services/match-media.service';
import { Subscription } from 'rxjs';
import { ProgressSpinnerComponent } from '../../shared/components/progress-spinner/progress-spinner.component';

@Component({
  selector: 'app-direct-message',
  standalone: true,
  templateUrl: './direct-message.component.html',
  styleUrl: './direct-message.component.scss',
  imports: [
    HeaderMobileComponent,
    TextBoxComponent,
    ConversationComponent,
    TimeSeperatorComponent,
    ProgressSpinnerComponent,
  ],
})
export class DirectMessageComponent implements OnInit {
  @ViewChild('messageContent') messageContent!: ElementRef;
  firestore = inject(FirestoreService);
  router = inject(Router);
  itemID: any = '';
  user: User = new User();
  channel: Channel = new Channel();
  authService = inject(AuthService);
  matchMedia = inject(MatchMediaService);
  routeSubscription: Subscription | undefined;

  textBoxData: any = {
    placeholder: 'Nachricht an ',
    channelName: '',
    messageText: '',
    channelId: '',
    collection: 'messages',
    subcollection: 'channelmessages',
  };

  userData = {
    avatar: this.user.avatar,
    email: this.user.email,
    displayName: this.user.displayName,
    isOnline: this.user.isOnline,
    provider: this.user.provider,
  };

  constructor(
    public dialog: MatDialog,
    private navigationService: NavigationService,
    private _bottomSheet: MatBottomSheet,
    private route: ActivatedRoute,
    private headerStateService: HeaderStateService,
    public dateFormatService: DateFormatService
  ) {}

  async ngOnInit(): Promise<void> {
    this.waitForUserData();

    this.routeSubscription = this.route.paramMap.subscribe(async (paramMap) => {
      this.test();
      this.itemID = paramMap.get('id');
      this.textBoxData.messageText = '';
      this.textBoxData.inputField = '';
      this.getItemValues('users', this.itemID);

      if (this.authService.activeUserAccount) {
        await this.firestore.getDirectMessages(
          this.authService.activeUserAccount.uid,
          this.itemID
        );
      }

      this.headerStateService.setAlternativeHeader(true);
      this.textBoxData.placeholder =
        'Nachricht an ' + this.matchMedia.channelName;

      await this.delay(700);
      if (this.firestore.conversation) {
        this.textBoxData.channelId = this.firestore.conversation;
        await this.firestore.getAllChannelMessages(
          this.firestore.conversation,
          this.textBoxData.collection,
          this.textBoxData.subcollection
        );
      }
      this.matchMedia.loading = false;
      setInterval(() => {
        this.scrollToBottom();
      }, 1000);
    });
  }

  async getItemValues(collection: string, itemID: string) {
    await this.delay(200);
    this.firestore.getSingleItemData(collection, itemID, () => {
      this.user = new User(this.firestore.user);
      this.textBoxData.channelName = this.channel.name;
      this.textBoxData.channelId = itemID;
    });
  }

  async waitForUserData(): Promise<void> {
    while (!this.authService.activeUserAccount) {
      await this.delay(100);
    }
  }

  delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  test() {
    if (this.authService.activeUserAccount) {
      let id = this.authService.activeUserAccount.uid;
      this.getItemValues('users', id);
    }
  }

  toggleOverlay(overlayId: string): void {
    const currentOverlay = document.querySelector(
      '.overlay[style="display: block;"]'
    ) as HTMLElement;
    const newOverlay = document.getElementById(overlayId);

    if (currentOverlay && currentOverlay.id !== overlayId) {
      currentOverlay.style.display = 'none';
    }

    if (newOverlay) {
      newOverlay.style.display =
        newOverlay.style.display === 'none' ? 'block' : 'none';
    }
  }

  closeOverlay(overlayId: string): void {
    const overlay = document.getElementById(overlayId) as HTMLElement;
    if (overlay) {
      overlay.style.display = 'none';
    }
  }

  openDirectMessageOverlay(): void {
    const dialogRef = this.dialog.open(DirectMessageOverlayComponent, {
      minWidth: '398px',
      minHeight: '600px',
      panelClass: 'custom-dialog-container',
      data: { user: this.user, itemId: this.itemID },
    });
  }

  async scrollToBottom() {
    await this.delay(200);

    if (this.matchMedia.scrollToBottom === true) {
      try {
        this.messageContent.nativeElement.scrollTo({
          top: this.messageContent.nativeElement.scrollHeight,
          behavior: 'smooth',
        });
      } catch (err) {}
    }
    this.matchMedia.scrollToBottom = false;
  }

  goBack(): void {
    this.navigationService.goBack();
  }

  openBottomSheet(): void {
    this._bottomSheet.open(BottomSheetComponent);
  }
}
