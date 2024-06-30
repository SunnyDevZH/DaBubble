import {Component} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatCard, MatCardContent, MatCardHeader, MatCardSubtitle, MatCardTitle} from '@angular/material/card';
import {RouterLink} from '@angular/router';
import {NavigationService} from '../shared/services/navigation.service';

@Component({
  selector: 'app-imprint',
  standalone: true,
  imports: [
    FormsModule,
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatCardSubtitle,
    MatCardTitle,
    RouterLink
  ],
  templateUrl: './imprint.component.html',
  styleUrl: './imprint.component.scss'
})
export class ImprintComponent {
  constructor(private navigationService: NavigationService) {
  }

  goBack(): void {
    this.navigationService.goBack();
  }
}
