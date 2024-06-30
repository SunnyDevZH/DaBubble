import {
  Component,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { BottomSheetComponent } from '../../shared/components/bottom-sheet/bottom-sheet.component';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { Channel } from '../../../models/channel.class';
import { FirestoreService } from '../../shared/services/firestore.service';
import { ActivatedRoute } from '@angular/router';
import { User } from '../../../models/user.class';
import { NavigationService } from '../../shared/services/navigation.service';
import { AuthService } from '../../shared/services/auth.service';
import { Auth } from '@angular/fire/auth';
import { ConversationComponent } from '../../shared/components/conversation/conversation.component';
import { HeaderMobileComponent } from '../../shared/components/header-mobile/header-mobile.component';
import { HeaderStateService } from '../../shared/services/header-state.service';
import { TextBoxComponent } from '../../shared/components/text-box/text-box.component';
import { DialogServiceService } from '../../shared/services/dialog-service.service';
import { SearchUserComponent } from '../../shared/components/search-user/search-user.component';
import { CommonModule } from '@angular/common';
import { DateFormatService } from '../../shared/services/date-format.service';
import { TimeSeperatorComponent } from '../../shared/components/time-seperator/time-seperator.component';
import { MatchMediaService } from '../../shared/services/match-media.service';
import { DataService } from '../../shared/services/data.service';
import { ChannelMessage } from '../../../models/channel-message.class';
import { ProgressSpinnerComponent } from "../../shared/components/progress-spinner/progress-spinner.component";

@Component({
    selector: 'app-channel',
    standalone: true,
    templateUrl: './channel.component.html',
    styleUrl: './channel.component.scss',
    imports: [
        RouterLink,
        BottomSheetComponent,
        ConversationComponent,
        HeaderMobileComponent,
        TextBoxComponent,
        CommonModule,
        SearchUserComponent,
        TimeSeperatorComponent,
        ProgressSpinnerComponent
    ]
})
export class ChannelComponent implements OnInit {
  firestore = inject(FirestoreService);
  router = inject(Router);
  itemID: any = '';
  user: User = new User();
  channel: Channel = new Channel();
  channelMessages: ChannelMessage = new ChannelMessage();
  channelList: any[] = [];
  firebaseAuth = inject(Auth);
  authService = inject(AuthService);
  isDesktop: boolean = false;
  matchMedia = inject(MatchMediaService);
  dataService = inject(DataService);
  textBoxData: any = {
    placeholder: 'Nachricht an #',
    channelName: '',
    messageText: '',
    channelId: '',
    collection: 'channels',
    subcollection: 'channelmessages',
  };
  hovering = false;

  @ViewChild('messageContent') messageContent!: ElementRef;

  constructor(
    private _bottomSheet: MatBottomSheet,
    private route: ActivatedRoute,
    public navigationService: NavigationService,
    private headerStateService: HeaderStateService,
    private dialogService: DialogServiceService,
    public dateFormatService: DateFormatService
  )
  {}

  channelData = {
    creator: this.channel.creator,
    description: this.channel.description,
    member: this.channel.member,
    name: this.channel.name,
  };

  async ngOnInit(): Promise<void> {
    this.dataService.searchWorkspace('');
    this.isDesktop = this.matchMedia.checkIsDesktop();
    await this.waitForUserData();
    this.test();

    this.route.paramMap.subscribe((paramMap) => {
      this.itemID = paramMap.get('id');
      this.textBoxData.messageText = '';
      this.textBoxData.inputField = '';

      this.firestore.getSingleItemData('channels', this.itemID, () => {
        this.channel = new Channel(this.firestore.channel);
        this.textBoxData.channelName = this.channel.name;

        this.firestore.channelMessages = [];
        this.firestore.getAllChannelMessages(
          this.itemID,
          this.textBoxData.collection,
          this.textBoxData.subcollection
        );
        this.textBoxData.channelName = this.channel.name;
        this.textBoxData.channelId = this.itemID;

        this.headerStateService.setAlternativeHeader(true);
        this.matchMedia.scrollToBottom = true;
        setInterval(() => {
          this.scrollToBottom();
          this.matchMedia.loading = false;
        }, 1000);
      });
    });
  }

  filterUsers() {
    return this.filterUsersById(this.firestore.getUsers(), this.channel.member);
  }
  
  filterUsersById(usersArray: any[], idsArray: string | any[]) {
    return usersArray.filter((user) => idsArray.includes(user.id));
  }

  async getItemValues(collection: string, itemID: string) {
    await this.delay(200);
    this.firestore.getSingleItemData(collection, itemID, () => {
      this.channel = new Channel(this.firestore.channel);
      this.textBoxData.channelName = this.channel.name;
      this.textBoxData.channelId = itemID;
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

  async waitForUserData(): Promise<void> {
    while (!this.authService.activeUserAccount) {
      await this.delay(100);
    }
  }

  delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  test() {
    let id = this.authService.activeUserAccount.uid;
    this.getItemValuesProfile('users', id);
  }

  toggleOverlay(overlayId: string): void {
    const newOverlay = document.getElementById(overlayId);
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

  openBottomSheet(): void {
    this._bottomSheet.open(BottomSheetComponent);
  }

  openChannel(event: MouseEvent, path: string) {
    const docRefId = (event.currentTarget as HTMLElement).id;
    this.router.navigate(['/' + path + '/' + docRefId]);
  }

  getItemValuesProfile(collection: string, itemID: string) {
    this.firestore.getSingleItemData(collection, itemID, () => {
      this.user = new User(this.firestore.user);
    });
  }

  openDialog(user: User, itemId: string) {
    this.dialogService.openDirectMessageDialog(user, itemId);
    this.closeOverlay('overlay1');
  }

  get memberCount(): number {
    return this.channel.member.length;
  }
}
