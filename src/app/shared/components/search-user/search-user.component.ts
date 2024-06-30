import { Component, OnInit, inject } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FirestoreService } from '../../services/firestore.service';
import { CommonModule } from '@angular/common';
import { User } from '../../../../models/user.class';
import { Channel } from '../../../../models/channel.class';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-search-user',
  standalone: true,
  imports: [NgIf, FormsModule, RouterLink, CommonModule],
  templateUrl: './search-user.component.html',
  styleUrl: './search-user.component.scss',
})
export class SearchUserComponent implements OnInit {
  users: User[] = [];
  showDropdown: boolean = false;
  overlayVisible: boolean = false;
  showInputField: boolean = false;
  showAddMember: boolean = false;
  showGeneralInputField: boolean = false;
  isAddAllMembersChecked: boolean = false;
  isAddSpecificMembersChecked: boolean = false;
  firestore = inject(FirestoreService);
  router = inject(Router);
  authService = inject(AuthService);
  itemID: any = '';
  activeUser: any = '';
  channel: Channel = new Channel();
  searchQuery: string = '';

  channelData = {
    creator: this.channel.creator,
    description: this.channel.description,
    member: this.channel.member,
    name: this.channel.name,
    // count: '',
    // newMessage: this.channel.newMessage,
  };

  onSubmit() {

    if (!this.isAddAllMembersChecked && !this.isAddSpecificMembersChecked) {
      this.closeOverlay('overlay');
    } else {

      let userIds;

      if (this.isAddAllMembersChecked) {
        userIds = this.getUserIds(this.firestore.getUsers());
      } else {
        userIds = this.channel.member;
      }
      const channel = new Channel({
        creator: this.authService.activeUserId,
        description: this.channelData.description,
        member: userIds,
        name: this.channelData.name,
        // newMessage: this.channel.newMessage,
      });

      this.firestore.updateChannel(this.itemID, channel);
      this.isAddAllMembersChecked = false;
      this.isAddSpecificMembersChecked = false;
      this.closeOverlay('overlay');
    }   
  }

  constructor(private route: ActivatedRoute) {}

  getUserIds(usersArray: any[]) {
    return usersArray.map((user) => user.id);
  }

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap) => {
      this.itemID = paramMap.get('id');
      this.getItemValues('channels', this.itemID);
    });
  }

  getItemValues(collection: string, itemID: string) {
    this.firestore.getSingleItemData(collection, itemID, () => {
      this.channel = new Channel(this.firestore.channel);
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
      // count: '',
      // newMessage: this.channel.newMessage,
    };
  }

  toggleMember(user: User) {    
    const index = this.channel.member.indexOf(user.id);
    if (index !== -1) {
      this.channel.member.splice(index, 1);
    } else {
      this.channel.member.push(user.id);
    }
  }

  onSearchInputChange(value: string) {
    this.searchQuery = value;
  }

  matchesSearch(user: any): boolean {
    if (!this.searchQuery || this.searchQuery.trim() === '') {
      return true;
    }
    return user.displayName
      .toLowerCase()
      .includes(this.searchQuery.toLowerCase());
  }

  toggleOverlay() {
    this.overlayVisible = !this.overlayVisible;
  }

  toggleInputField(inputId: string) {
    if (inputId === 'addSpecificMembers') {
      this.showInputField = !this.showInputField;
      this.showAddMember = false;
    } else if (inputId === 'searchPeople') {
      if (this.showInputField) {
        this.showAddMember = !this.showAddMember;
      } else {
        this.showInputField = true;
        this.showAddMember = true;
      }
    }
  }

  toggleCheckbox(checkboxId: string): void {
    if (checkboxId === 'addAllMembers') {
      this.isAddAllMembersChecked = true;
      this.isAddSpecificMembersChecked = false;
      this.showInputField = false;
    } else if (checkboxId === 'addSpecificMembers') {
      this.isAddAllMembersChecked = false;
      this.isAddSpecificMembersChecked = true;
    }
  }

  getInputValue(event: any): string {
    return event && event.target && event.target.value;
  }

  closeOverlay(overlayId: string): void {
    const overlay = document.getElementById(overlayId) as HTMLElement;
    if (overlay) {
      overlay.style.display = 'none';
    }

    this.showAddMember = false;
    this.showInputField = false;
    this.isAddAllMembersChecked = false;
    this.isAddSpecificMembersChecked = false;
  }

  filterUsers() {    
    return this.filterUsersById(this.firestore.getUsers(), this.channel.member);    
  }
  
  filterUsersById(usersArray: any[], idsArray: string | any[]) {
    return usersArray.filter((user) => idsArray.includes(user.id));
  }

}
