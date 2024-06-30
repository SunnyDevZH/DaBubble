import {Component} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatCard, MatCardContent, MatCardHeader, MatCardSubtitle, MatCardTitle} from '@angular/material/card';
import {RouterLink} from '@angular/router';
import {NavigationService} from '../shared/services/navigation.service';

@Component({
  selector: 'app-privacy-policy',
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
  templateUrl: './privacy-policy.component.html',
  styleUrl: './privacy-policy.component.scss'
})
export class PrivacyPolicyComponent {
  constructor(private navigationService: NavigationService) {
  }
  
  goBack(): void {
    this.navigationService.goBack();
  }

}
