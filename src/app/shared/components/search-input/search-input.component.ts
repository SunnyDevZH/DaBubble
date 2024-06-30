import {Component, EventEmitter, Input, Output, inject} from '@angular/core';
import {FormsModule} from '@angular/forms';
import { DataService } from '../../services/data.service';
import { MatchMediaService } from '../../services/match-media.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-search-input',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule
  ],
  templateUrl: './search-input.component.html',
  styleUrl: './search-input.component.scss'
})
export class SearchInputComponent {
  textData = { text: '' };
  inputHasValue = false;
  matchMedia = inject(MatchMediaService);
  isDesktop: boolean = false;
  showDropdown = false;
  filteredResults: any[] = [];

  dataService = inject(DataService);
  @Output() search = new EventEmitter<string>(); 

  constructor(){
    this.isDesktop = this.matchMedia.checkIsDesktop();
  }

  async onSearchChange(query: string) {
    if (query) {
      await this.dataService.searchWorkspace(query);
      this.filteredResults = [
        ...this.dataService.channelMatches,
        ...this.dataService.userMatches,
        ...this.dataService.messageMatches
      ];
      this.showDropdown = this.filteredResults.length > 0;
    } else {
      this.filteredResults = [
        ...this.dataService.allChannels,
        ...this.dataService.allUsers,
        ...this.dataService.allMessages
      ];
      this.showDropdown = true;
      // this.filteredResults = [];
      // this.showDropdown = false;
      // this.search.emit('');  // Emit an empty string to indicate the input was cleared
    }
  }

  onResultClick(result: any) {
    this.textData.text = result.name || result.displayName || result.text;
    this.showDropdown = false;
    this.search.emit(this.textData.text);
  }
}
