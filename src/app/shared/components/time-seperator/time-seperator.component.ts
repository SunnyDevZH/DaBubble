import { Component, Input, OnInit, input } from '@angular/core';
import { DateFormatService } from '../../services/date-format.service';

@Component({
  selector: 'app-time-seperator',
  standalone: true,
  imports: [],
  templateUrl: './time-seperator.component.html',
  styleUrl: './time-seperator.component.scss'
})
export class TimeSeperatorComponent{
  
  @Input() seperatorDate: any = 'Heute';
  currentDate: any;

  constructor(
    public dateFormatService: DateFormatService,
  ){
    this.getCurrentDay();    
  }

  getCurrentDay() {
    const date = new Date();
    let day = date.getDate().toString().padStart(2, '0');
    let month = (date.getMonth() + 1).toString().padStart(2, '0');
    let year = date.getFullYear().toString();
    this.currentDate = year + month + day;
  }
}
