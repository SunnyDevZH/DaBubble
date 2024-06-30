import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filename',
  standalone: true
})
export class FilenamePipe implements PipeTransform {

  transform(value: string): string {
    if (!value) {
      return '';
    }
    try {
      const decodedUrl = decodeURIComponent(value);      
      const startIndex = decodedUrl.indexOf('attachments/') + 'attachments/'.length;
      let filename = decodedUrl.substring(startIndex);
      const endIndex = filename.indexOf('?');
      if (endIndex !== -1) {
        filename = filename.substring(0, endIndex);
      }
      return filename;
    } catch (e) {
      return value;
    }
  }
}
