import { Component, OnInit, inject } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { FirestoreService } from '../../../shared/services/firestore.service';
import { CommonModule } from '@angular/common';
import { User } from '../../../../models/user.class';
import { Channel } from '../../../../models/channel.class';
import { AuthService } from '../../../shared/services/auth.service';
import { MatchMediaService } from '../../../shared/services/match-media.service';
@Component({
  selector: 'app-add-channel',
  standalone: true,
  imports: [NgIf, FormsModule, RouterLink, CommonModule],
  templateUrl: './add-channel.component.html',
  styleUrl: './add-channel.component.scss',
})
export class AddChannelComponent implements OnInit {
  selectedUsers: User[] = [];
  selectedUser: any = [];
  users: User[] = [];
  selected: boolean = false;
  showDropdown: boolean = false;
  overlayVisible: boolean = false;
  showInputField: boolean = false;
  showAddMember: boolean = false;
  isAddAllMembersChecked: boolean = false;
  isAddSpecificMembersChecked: boolean = false;
  firestore = inject(FirestoreService);
  router = inject(Router);
  matchMedia = inject(MatchMediaService);
  authService = inject(AuthService);
  isDesktop: boolean = false;
  activeUser: any = '';
  channelNameExists: boolean = false;
  channelNameEmpty: boolean = false;
  channel: Channel = new Channel();
  searchQuery: string = '';

  channelData = {
    creator: '',
    description: '',
    member: [],
    name: '',
    user: '',
    count: '',
    newMessage: '',
  };

  onSubmit() {
    let userIds;

    if (this.isAddAllMembersChecked) {
      userIds = this.getUserIds(this.firestore.getUsers());
    } else {
      userIds = this.getUserIds(this.selectedUsers);
      const activeUserId = this.authService.activeUserId;
      const idExists = userIds.includes(activeUserId);

      if (!idExists) {
        userIds.push(activeUserId);
      }
    }

    const channel = new Channel({
      creator: this.authService.activeUserId,
      description: this.channelData.description,
      member: userIds,
      name: this.channelData.name,
      count: this.channelData.count,
      newMessage: this.channelData.newMessage,
    });

    this.firestore.addChannel(channel);
    this.matchMedia.channelName = channel.name;
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

  getUserIds(usersArray: any[]) {
    return usersArray.map((user) => user.id);
  }

  ngOnInit(): void {
    this.isDesktop = this.matchMedia.checkIsDesktop();
  }

  addmember(event: MouseEvent, user: User) {
    const index = this.selectedUsers.findIndex(
      (selectedUser) => selectedUser.id === user.id
    );

    if (index === -1) {
      this.selectedUsers.push(user);
    } else {
      this.selectedUsers.splice(index, 1);
    }
  }

  removeUser(user: User) {
    const index = this.selectedUsers.findIndex(
      (selectedUser) => selectedUser.id === user.id
    );
    if (index !== -1) {
      this.selectedUsers.splice(index, 1);
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
    if (this.channelData.name !== '') {
      this.channelNameEmpty = false;
      this.channelNameExists = this.checkChannelName(this.channelData.name);
      if (this.channelNameExists == false) {
        this.overlayVisible = !this.overlayVisible;
      }
    }
    else {
      this.channelNameEmpty = true;
    }
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
      this.selectedUsers = [];
      this.isAddAllMembersChecked = false;
      this.isAddSpecificMembersChecked = true;
    }
  }
  getInputValue(event: any): string {
    return event && event.target && event.target.value;
  }
}
