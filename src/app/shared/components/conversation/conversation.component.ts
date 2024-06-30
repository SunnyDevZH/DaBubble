import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { ChannelMessage } from '../../../../models/channel-message.class';
import { User } from '../../../../models/user.class';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { EmojiPickerComponent } from '../emoji-picker/emoji-picker.component';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { DateFormatService } from '../../services/date-format.service';
import { PositionService } from '../../services/position.service';
import { Router } from '@angular/router';
import { MatchMediaService } from '../../services/match-media.service';
import { Subscription } from 'rxjs';
import { FirestoreService } from '../../services/firestore.service';
import { FilenamePipe } from '../../pipes/filename.pipe';

@Component({
  selector: 'app-conversation',
  standalone: true,
  templateUrl: './conversation.component.html',
  styleUrl: './conversation.component.scss',
  imports: [
    CommonModule,
    MatDialogModule,
    EmojiPickerComponent,
    FormsModule,
    FilenamePipe,
  ],
})
export class ConversationComponent implements OnInit, AfterViewInit, OnDestroy {
  constructor(
    private dialog: MatDialog,
    public dateFormatService: DateFormatService,
    private positionService: PositionService,
  ) {
    this.previousMessageDate = '';
  }

  firestore = inject(FirestoreService);
  router = inject(Router);
  matchMedia = inject(MatchMediaService);
  authService = inject(AuthService);
  @Input() channelMessage!: ChannelMessage;
  @Input() isChannel!: boolean;
  @Input() isThread!: boolean;
  @Input() isDirectMessage!: boolean;
  @Input() hideCompleteReactionBar: boolean = false;
  @Input() hideThreadInfos: boolean = false;
  @Input() index!: number;
  user: User = new User();
  edit: boolean = false;
  hovered: boolean = false;
  isMessageFromYou: boolean = false;
  messageDate: any;
  showReactionBar: boolean = false;
  showEditMessage: boolean = false;
  isMessageDisabled: boolean = true;
  showBubble: boolean[] = [];
  savedMessage: string = '';
  isDesktop: boolean = false;
  @ViewChild('messageToEdit') messageToEdit!: ElementRef<HTMLTextAreaElement>;
  previousMessageDate: string;
  mainCollection: Subscription | undefined;
  timestampLastThread: any;
  fileType: boolean = false;

  async ngOnInit(): Promise<void> {
    await this.delay(200);
    this.getItemValuesProfile('users', this.channelMessage.creator);
    this.isMessageFromYou =
      this.authService.activeUserAccount.uid === this.channelMessage.creator;

    if (this.channelMessage.messageId !== undefined) {
      const docRef =
        this.channelMessage.channelId +
        '/channelmessages/' +
        this.channelMessage.messageId;
      this.mainCollection = this.firestore
        .getChannelData(docRef)
        .subscribe((data) => {          
          // console.log('MainCollection Data in Component:', data);
          
          if (data !== undefined) {
            this.channelMessage.creator = data['creator'];
            this.channelMessage.createdAt = data['createdAt'];
            this.channelMessage.text = data['text'];
            this.channelMessage.reactions = data['reactions'];
            this.channelMessage.attachment = data['attachment'];

            if (this.channelMessage.attachment) {
              this.fileType =
                this.channelMessage.attachment![0].includes('.pdf?');
            }

            this.channelMessage.threads = data['threads'];
            this.adjustTextareaHeight(this.messageToEdit.nativeElement);
            this.fillEmojiReactions();
            this.timestampLastThread = data['timestampLastThread'];
            this.matchMedia.scrollToBottom = true;
            this.matchMedia.scrollToBottomThread = true;
          }
        });
    }
  }

  async ngAfterViewInit() {
    await this.delay(200);
    this.adjustTextareaHeight(this.messageToEdit.nativeElement);
  }
  
  setShowBubble(index: number, show: boolean): void {
    this.showBubble[index] = show;    
    if(show){
      setTimeout(() => {
        this.showBubble[index] = false;
      }, 2000);
    }
  }

  handleTouchStart(event: TouchEvent, index: number): void {    
    if (!event.defaultPrevented) {
      this.setShowBubble(index, true);
    }
  }

  handleTouchEnd(event: TouchEvent, index: number): void {    
    if (!event.defaultPrevented) {
      this.setShowBubble(index, false);
    }
  }

  getDisplayNameById(id: string): string | undefined {
    const user = this.firestore.userList.find((user: { id: string; }) => user.id === id);
    return user ? user.displayName : undefined;
  }

  getDisplayNamesWithCurrentUser(reactionUsers: string[]): string[] {
    const currentUserDisplayName = this.authService.activeUserAccount.displayName;
    const displayNames = reactionUsers
      .map(userId => this.getDisplayNameById(userId))
      .filter((name): name is string => name !== undefined);

    const isCurrentUserIncluded = displayNames.includes(currentUserDisplayName);

    if (isCurrentUserIncluded) {
      if (displayNames.length === 1) {
        return ['Du hast'];
      } else {
        return [...displayNames.filter(name => name !== currentUserDisplayName), 'und Du habt'];
      }
    }

    return displayNames;
  }

  getLeftPosition(index: number): number {
    if (index === 0) {
      return 30;
    } else if (index === 1) {
      return 94;
    } else {
      return 94 + (index - 1) * 64;
    }
  }

  ngOnDestroy() {
    if (this.mainCollection) {
      this.mainCollection.unsubscribe();
    }
  }

  fillEmojiReactions() {
    const filterEmojisWithUsers = (data: any[]) => {
      return data.filter((entry) => entry.users.length > 0);
    };

    const filteredData = filterEmojisWithUsers(this.channelMessage.reactions);
    this.channelMessage.reactions = filteredData;
  }

  async getItemValuesProfile(collection: string, itemID: string) {
    await this.delay(200);
    this.firestore.getSingleItemData(collection, itemID, () => {
      this.user = new User(this.firestore.user);
    });
  }

  deleteHovered() {
    if (!this.edit) {
      this.hovered = false;
    }
  }

  openEmojiPicker(): void {
    const dialogRef = this.dialog.open(EmojiPickerComponent, {
      width: '400px',
      height: '300px',
    });

    dialogRef.componentInstance.emojiSelect.subscribe((selectedEmoji) => {
      this.addEmojiReaction(selectedEmoji);
      dialogRef.close();
    });
  }

  addEmojiReaction(selectedEmoji: string) {
    const existingEmoji = this.channelMessage.reactions.find(
      (e) => e.emoji === selectedEmoji
    );
    const userId = this.authService.activeUserAccount.uid;

    if (existingEmoji) {
      if (!existingEmoji.users.includes(userId)) {
        existingEmoji.users.push(userId);
      }
    } else {
      this.channelMessage.reactions.push({
        emoji: selectedEmoji,
        users: [userId],
      });
    }    
    this.saveMessage();    
  }

  getUserReactionCount(selectedEmoji: string): number {
    const existingEmoji = this.channelMessage.reactions.find(
      (e) => e.emoji === selectedEmoji
    );
    if (existingEmoji && existingEmoji.users) {
      const uniqueUsers = new Set(existingEmoji.users);
      return uniqueUsers.size;
    } else {
      return 0;
    }
  }

  toggleReaction(reaction: { emoji: string; users: string[] }): void {
    const userIndex = reaction.users.indexOf(
      this.authService.activeUserAccount.uid
    );
    if (userIndex === -1) {
      reaction.users.push(this.authService.activeUserAccount.uid);
    } else {
      reaction.users.splice(userIndex, 1);
    }    
    this.saveMessage();
  }

  toggleReactionBar(event: any): void {
    event.preventDefault();
    this.showReactionBar = !this.showReactionBar;
    if (!this.showReactionBar) {
      const setFocusMessage = this.messageToEdit.nativeElement;
      setFocusMessage.classList.remove('edit-message');
      this.isMessageDisabled = true;
      this.showEditMessage = false;
    }
  }

  doNotClose(event: any): void {
    event.stopPropagation();
  }

  toggleEditMessage(event: any): void {
    event.preventDefault();
    this.showEditMessage = !this.showEditMessage;
  }

  editMessage(id?: string): void {
    if (id) {
      this.isMessageDisabled = false;
      const setFocusMessage = this.messageToEdit.nativeElement;
      setFocusMessage.classList.add('edit-message');

      if (setFocusMessage.value) {
        this.savedMessage = setFocusMessage.value;
        setTimeout(() => {
          this.showEditMessage = false;
          this.showReactionBar = false;
          this.messageToEdit.nativeElement.focus();
        }, 200);
      }
    }
  }

  noChanges() {
    const setFocusMessage = this.messageToEdit.nativeElement;
    setFocusMessage.value = this.savedMessage;

    setTimeout(() => {
      this.showEditMessage = false;
      this.showReactionBar = false;
      this.isMessageDisabled = true;
      setFocusMessage.classList.remove('edit-message');
    }, 200);
  }

  async changeMessage() {
    let messageId = this.channelMessage.messageId;

    if (messageId) {
      const setFocusMessage = this.messageToEdit.nativeElement;
      this.channelMessage.text = setFocusMessage.value;      
      this.saveMessage();

      setTimeout(() => {
        setFocusMessage.classList.remove('edit-message');
        this.isMessageDisabled = true;
        this.showReactionBar = false;
      }, 200);
    }
  }

  saveMessage() {
    if (this.channelMessage.messageId !== undefined) {
      let colId = 'channels';

      if (this.isThread) {
        this.channelMessage.messageId =
          this.matchMedia.subID + '/threads/' + this.channelMessage.messageId;
      }

      if(this.isDirectMessage){
        colId = 'messages';
      }

      this.firestore.saveMessageData(        
        colId,
        this.channelMessage.channelId,
        this.channelMessage.messageId,
        this.channelMessage
      );
    }
  }

  async adjustTextareaHeight(textarea: HTMLTextAreaElement) {
    await this.delay(100);
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  }

  async openThread() {

    this.matchMedia.showThread = false;
    this.matchMedia.hideReactionIcons = false;
    await this.delay(200);

    const docId = this.channelMessage.channelId;
    const messageId = this.channelMessage.messageId;
    this.isDesktop = this.matchMedia.checkIsDesktop();

    if (messageId) {
      this.matchMedia.channelId = docId;
      this.matchMedia.subID = messageId;

      if(this.isDirectMessage){
        this.matchMedia.collectionType = 'messages';
        // console.log(this.matchMedia.collectionType);     
      }else{
        this.matchMedia.collectionType = 'channels';
        // console.log(this.matchMedia.collectionType);
      }

      if (this.isDesktop === true) {
        this.matchMedia.showThread = true;
      } else {
        this.matchMedia.hideReactionIcons = true;
        this.router.navigate(['/thread']);
      }
    }
  }

  delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  hasReactionsWithUsers(): boolean {
    return this.channelMessage.reactions.some(reaction => reaction.users.length > 0) && 
           !this.hideCompleteReactionBar;
  }

}
