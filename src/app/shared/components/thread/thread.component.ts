import {
  Component,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { BottomSheetComponent } from '../bottom-sheet/bottom-sheet.component';
import { Channel } from '../../../../models/channel.class';
import { FirestoreService } from '../../services/firestore.service';
import { User } from '../../../../models/user.class';
import { NavigationService } from '../../services/navigation.service';
import { AuthService } from '../../services/auth.service';
import { Auth } from '@angular/fire/auth';
import { ConversationComponent } from '../conversation/conversation.component';
import { HeaderMobileComponent } from '../header-mobile/header-mobile.component';
import { HeaderStateService } from '../../services/header-state.service';
import { TextBoxComponent } from '../text-box/text-box.component';
import { SearchUserComponent } from '../search-user/search-user.component';
import { CommonModule } from '@angular/common';
import { MatchMediaService } from '../../services/match-media.service';
import { ChannelMessage } from '../../../../models/channel-message.class';

@Component({
  selector: 'app-thread',
  standalone: true,
  imports: [
    RouterLink,
    BottomSheetComponent,
    ConversationComponent,
    HeaderMobileComponent,
    TextBoxComponent,
    CommonModule,
    SearchUserComponent,
  ],
  templateUrl: './thread.component.html',
  styleUrl: './thread.component.scss',
})
export class ThreadComponent implements OnInit, OnDestroy {
  firestore = inject(FirestoreService);
  matchMedia = inject(MatchMediaService);
  router = inject(Router);
  itemID: any = '';
  user: User = new User();
  channel: Channel = new Channel();
  channelMessage: ChannelMessage = new ChannelMessage();
  channelList: any = [];
  newMessage: boolean = false;
  firebaseAuth = inject(Auth);
  authService = inject(AuthService);  
  textBoxData: any = {
    placeholder: 'Antworten...',
    channelName: '',
    messageText: '',
    channelId: '',
    collection: 'channels',
    subcollection: 'channelmessages',
  };

  @ViewChild('threadContent') threadContent!: ElementRef;
  isDesktop: boolean = false;

  constructor(
    public navigationService: NavigationService,
    private headerStateService: HeaderStateService,
  ) {}
  
  ngOnDestroy(): void {
    this.matchMedia.hideReactionIcons = false;
  }

  channelData = {
    creator: this.channel.creator,
    description: this.channel.description,
    member: this.channel.member,
    name: this.channel.name,
    // newMessage: this.channel.newMessage,
  };

  async ngOnInit(): Promise<void> {
    await this.waitForUserData();
    this.test();    
    this.newMessage = false;    
    this.headerStateService.setAlternativeHeader(true);
    this.scrollToBottom();

    await this.firestore.getSingleMessageData(this.matchMedia.collectionType, this.matchMedia.channelId + '/channelmessages/' + this.matchMedia.subID, () => {});
    await this.firestore.getAllChannelThreads(this.matchMedia.channelId, this.matchMedia.collectionType, 'channelmessages/' + this.matchMedia.subID + '/threads');
    
    this.textBoxData.channelId = this.matchMedia.channelId;
    this.textBoxData.subcollection = 'channelmessages/' + this.matchMedia.subID + '/threads';
    
    this.matchMedia.scrollToBottomThread = true;
    setInterval(() => {
      this.scrollToBottom();
    }, 1000);
  }

  async scrollToBottom() {
    await this.delay(200);

    if (this.matchMedia.scrollToBottomThread === true) {
      try {
        this.threadContent.nativeElement.scrollTo({
          top: this.threadContent.nativeElement.scrollHeight,
          behavior: 'smooth',
        });
      } catch (err) {}
    }
    this.matchMedia.scrollToBottomThread = false;
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

  getItemValuesProfile(collection: string, itemID: string) {
    this.firestore.getSingleItemData(collection, itemID, () => {
      this.user = new User(this.firestore.user);
    });
  }

  closeThread() {
    this.isDesktop = this.matchMedia.checkIsDesktop();
    this.matchMedia.scrollToBottom = true;
    
    if (this.isDesktop === true) {
      this.matchMedia.showThread = false;
    } else {
      history.back();
    }
  }
  
}
