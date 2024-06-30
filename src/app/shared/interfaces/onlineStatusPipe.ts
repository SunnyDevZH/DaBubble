import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'onlineStatus'
})
export class OnlineStatusPipe implements PipeTransform {
  transform(value: boolean): string {
    return value ? 'Aktiv' : 'Abwesend';
  }
}
