import { Injectable, inject } from "@angular/core";
import { Channel } from "../../../models/channel.class";
import { User } from "../../../models/user.class";
import { MatchMediaService } from "./match-media.service";
import { FirestoreService } from "./firestore.service";
import { AuthService } from "./auth.service";

@Injectable({
    providedIn: "root",
})
export class DataService {
    allChannels: Channel[] = [];
    channelMatches: any;
    allUsers: User[] = [];
    userMatches: any;
    allMessages: any[] = []; // Array to store all messages
    messageMatches: any;
    noUserFound: boolean = false;
    noChannelFound: boolean = false;
    noMessageFound: boolean = false;
    matchMedia = inject(MatchMediaService);
    firestore = inject(FirestoreService);
    authService = inject(AuthService);

    constructor() {
        this.loadInitialData();
    }

    // Method to load initial data
    async loadInitialData() {
        this.allChannels = await this.firestore.getAllChannels();
        this.allUsers = await this.firestore.getAllUsers();
        this.allMessages = await this.firestore.getAllMessages();
    }

    async searchWorkspace(query: string) {
        if (query == "") {
            const filteredData = this.firestore.channelList.filter(
                (item: { member: string | string[] }) =>
                    item.member.includes(this.authService.activeUserId)
            );
            this.channelMatches = filteredData;
            this.userMatches = this.firestore.userList;
            this.messageMatches = this.allMessages;
            return;
        }
        this.matchMedia.channelName = "";

        query = query.toLowerCase();

        this.channelMatches = this.allChannels
            .filter((channel) => channel.name.toLowerCase().includes(query))
            .map((channel) => ({ ...channel, type: "channel" }));

        this.userMatches = this.allUsers
            .filter(
                (user) =>
                    user.displayName!.toLowerCase().includes(query) ||
                    user.email.toLowerCase().includes(query)
            )
            .map((user) => ({ ...user, type: "user" }));

        this.messageMatches = this.allMessages
            .filter((message) => message.text.toLowerCase().includes(query))
            .map((message) => ({ ...message, type: "message" }));

        this.noUserFound = this.userMatches.length === 0;
        this.noChannelFound = this.channelMatches.length === 0;
        this.noMessageFound = this.messageMatches.length === 0;
    }

    isChannelMember(members: string[]): boolean {
        return members.includes(this.authService.activeUserAccount);
    }

    /**
     * Checks if the `searchValue` is partially contained in any of the channel names.
     * @param searchValue - The value to search for.
     * @returns `true` if the `searchValue` is partially contained in any channel name, `false` otherwise.
     */
    containsPartialChannelValue(searchValue: string) {
        if (this.channelMatches) {
            return this.channelMatches.some(
                (item: { name: string | string[] }) =>
                    item.name.includes(searchValue)
            );
        }
    }

    containsPartialUserValue(searchValue: string) {
        if (this.userMatches) {
            return this.userMatches.some(
                (item: { displayName: string | string[] }) =>
                    item.displayName.includes(searchValue)
            );
        }
    }

    containsPartialMessageValue(searchValue: string) {
      if (this.messageMatches) {
        return this.messageMatches.some((item: { text: string | string[] }) =>
          item.text.includes(searchValue)
        );
      }
    }
}
