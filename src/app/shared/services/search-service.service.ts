import { Injectable } from '@angular/core';
import { Channel } from '../../../models/channel.class';
import { User } from '../../../models/user.class';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  allChannels: Channel[] = [];
  allUsers: User[] = [];
  filteredResults: any[] = [];
  noUserFound: boolean = false;
  noChannelFound: boolean = false;

  constructor() { }

  performSearch(query: string) {
    if (!query) {
      this.filteredResults = [];
      return;
    }
    query = query.toLowerCase();

    let channelMatches = this.allChannels.filter(channel => channel.name.toLowerCase().includes(query))
      .map(channel => ({ ...channel, type: 'channel' }));
    let userMatches = this.allUsers.filter(user => user.displayName.toLowerCase().includes(query) || user.email.toLowerCase().includes(query))
      .map(user => ({ ...user, type: 'user' }));

    this.filteredResults = [...channelMatches, ...userMatches];
  }

  hideElements(selector: string, searchText: string) {
    const elements = Array.from(document.querySelectorAll(selector)) as HTMLElement[];
    let found = 0;

    elements.forEach(element => {
      const text = element.innerText.toLowerCase();
      if (text.includes(searchText.toLowerCase())) {
        element.classList.remove('d-none');
        found++;
      } else {
        element.classList.add('d-none');
      }
    });

    return found === 0;
  }
}
