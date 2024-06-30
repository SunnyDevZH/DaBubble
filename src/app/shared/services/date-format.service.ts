import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DateFormatService {
  private months: string[] = [
    'Januar',
    'Februar',
    'März',
    'April',
    'Mai',
    'Juni',
    'Juli',
    'August',
    'September',
    'Oktober',
    'November',
    'Dezember',
  ];

  private weekdays: string[] = [
    'Sonntag',
    'Montag',
    'Dienstag',
    'Mittwoch',
    'Donnerstag',
    'Freitag',
    'Samstag',
  ];

  formatDateYYYYMMDD(timestamp: any): string {
    if (timestamp && timestamp.seconds) {  
        const date = new Date(timestamp.seconds * 1000);
        const formattedDate = date.toISOString().slice(0, 10).replace(/-/g, '');
        return formattedDate;
    } else {        
        return 'Datum nicht verfügbar';
    }
}

  formatDate(timestamp: { seconds: number; nanoseconds: number }): any {
    if (timestamp && timestamp.seconds) {
      const date = new Date(timestamp.seconds * 1000);
      const day = this.weekdays[date.getUTCDay()];
      const dayOfMonth = date.getUTCDate();
      const month = this.months[date.getUTCMonth()];
      return `${day}, ${dayOfMonth} ${month}`;
    }
  }

  formatTime(timestamp: { seconds: number; nanoseconds: number }): any {
    if (timestamp && timestamp.seconds) {
      const date = new Date(timestamp.seconds * 1000);
      const hours = ((date.getUTCHours() + 2) % 24).toString().padStart(2, '0');
      const minutes = date.getUTCMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    }
  }
  
}
