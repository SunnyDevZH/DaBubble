import {Component, EventEmitter, Output} from '@angular/core';
import { HeaderMobileComponent } from "../header-mobile/header-mobile.component";
import {SearchInputComponent} from '../search-input/search-input.component';

@Component({
    selector: 'app-desktop-headline',
    standalone: true,
    templateUrl: './desktop-headline.component.html',
    styleUrl: './desktop-headline.component.scss',
    imports: [HeaderMobileComponent, SearchInputComponent]
})
export class DesktopHeadlineComponent {
  textData = { text: '' };
  inputHasValue = false;

  @Output() search = new EventEmitter<string>();

  searchWorkspace(query: string) {
    this.inputHasValue = !!query;
    this.search.emit(query);
  }
}
