import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FirestoreService } from '../../../shared/services/firestore.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Channel } from '../../../../models/channel.class';
import { User } from '../../../../models/user.class';
import { AuthService } from '../../../shared/services/auth.service';
import { CommonModule } from '@angular/common';
import { SearchUserComponent } from '../../../shared/components/search-user/search-user.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-channel-edition',
  standalone: true,
  imports: [FormsModule, RouterLink, CommonModule, SearchUserComponent],
  templateUrl: './channel-edition.component.html',
  styleUrl: './channel-edition.component.scss',
})
export class ChannelEditionComponent implements OnInit {
  selectedUser: any = [];
  router = inject(Router);
  itemID: any = '';
  user: User = new User();
  firestore = inject(FirestoreService);
  authService = inject(AuthService);
  channel: Channel = new Channel();
  isEditingChannelName: boolean = false;
  isEditingDescription: boolean = false;
  channelNames: string[] = [];
  channelNameExists: boolean = false;
  private subscription?: Subscription;

  channelData = {
    creator: this.channel.creator,
    description: this.channel.description,
    member: this.channel.member,
    name: this.channel.name,
    // newMessage: this.channel.newMessage,
  };

  constructor(
    private route: ActivatedRoute,
    private firestoreService: FirestoreService
  ) {}

  onSubmit(toggle: string) {
    if (
      this.channel.name.toLowerCase() !== this.channelData.name.toLowerCase()
    ) {
      this.channelNameExists = this.checkChannelName(this.channelData.name);

      if (this.channelNameExists == false) {
        if (this.channelData.name === '') {
          this.channelData.name = this.channel.name;
        }
        if (this.channelData.description === '') {
          this.channelData.description = this.channel.description;
        }
        if (
          this.channelData.member.length === 0 &&
          Array.isArray(this.channel.member)
        ) {
          this.channelData.member = this.channel.member;
        }
        const channel = new Channel({
          creator: this.channel.creator,
          description: this.channelData.description,
          member: this.channel.member,
          name: this.channelData.name,
          // newMessage: this.channel.newMessage,
        });
        this.firestore.updateChannel(this.itemID, channel);
        this.toggleEdit(toggle);
      }
    } else {
      this.toggleEdit(toggle);
    }
  }

  checkChannelName(name: string) {
    const nameNotExists = this.firestore.channelList.some(      
      (channel: { name: string }) => channel.name.toLowerCase() === name.toLowerCase()
    );
    if (nameNotExists) {
      return true;
    } else {
      return false;
    }
  }

  toggleEdit(field: string) {
    if (field === 'channelName') {
      this.isEditingChannelName = !this.isEditingChannelName;
    } else if (field === 'channelDescription') {
      this.isEditingDescription = !this.isEditingDescription;
    }
  }

  toggleOverlay(overlayId: string): void {
    const currentOverlay = document.querySelector(
      '.overlay1[style="display: block;"]'
    ) as HTMLElement;
    const newOverlay = document.getElementById(overlayId);

    if (currentOverlay && currentOverlay.id !== overlayId) {
      // Schließe das aktuelle Overlay, wenn ein anderes Overlay geöffnet ist
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

  async ngOnInit(): Promise<void> {
    this.route.paramMap.subscribe(async (paramMap) => {
      this.itemID = paramMap.get('id');
      this.getItemValues('channels', this.itemID);
      await this.waitForUserData();
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  async waitForUserData(): Promise<void> {
    while (!this.authService.activeUserAccount) {
      await this.delay(100);
    }
  }

  delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  getItemValues(collection: string, itemID: string) {
    this.firestore.getSingleItemData(collection, itemID, () => {
      this.channel = new Channel(this.firestore.channel);
      this.user = new User(this.firestore.user);
    });
    setTimeout(() => {
      this.setOldChannelValues();
    }, 1000);
  }

  setOldChannelValues() {
    this.channelData = {
      creator: this.channel.creator,
      description: this.channel.description,
      member: this.channel.member,
      name: this.channel.name,
      // newMessage: this.channel.newMessage,
    };
  }

  openChannel(event: MouseEvent, path: string) {
    const docRefId = (event.currentTarget as HTMLElement).id;    
    this.router.navigate(['/' + path + '/' + docRefId]);
  }

  removeMember() {
    const index = this.channel.member.indexOf(this.authService.activeUserId);
    if (index !== -1) {
      this.channel.member.splice(index, 1);
    }
    
    const channel = new Channel({
      creator: this.channel.creator,
      description: this.channelData.description,
      member: this.channel.member,
      name: this.channelData.name,
      // newMessage: this.channel.newMessage,
    });   
    this.firestore.updateChannel(this.itemID, channel);
    this.router.navigate(['/main']);
  }

  filterUsers() {
    return this.filterUsersById(this.firestore.getUsers(), this.channel.member);
  }
  
  filterUsersById(usersArray: any[], idsArray: string | any[]) {
    return usersArray.filter((user) => idsArray.includes(user.id));
  }

}
