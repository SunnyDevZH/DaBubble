import { Component, EventEmitter, Output } from '@angular/core';
import { EmojiEvent } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';

@Component({
  selector: 'app-emoji-picker',
  templateUrl: './emoji-picker.component.html',
  styleUrls: ['./emoji-picker.component.scss'],
  standalone: true,
  imports: [
    PickerComponent
  ]
})
export class EmojiPickerComponent {
  @Output() emojiSelect = new EventEmitter<string>();

  onEmojiSelect(event: EmojiEvent) {
    if (event.emoji && event.emoji.unified) {
      const emojiUnicode = this.convertToNative(event.emoji.unified);      
      this.emojiSelect.emit(emojiUnicode);
    }
  }
  convertToNative(unified: string): string {
    return unified.split('-')
      .map(u => String.fromCodePoint(parseInt(u, 16)))
      .join('');
  }
}


