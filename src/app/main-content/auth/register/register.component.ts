import { HttpClient } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../shared/services/auth.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogActions,
  MatDialogContent,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { ChooseAvatarComponent } from './choose-avatar/choose-avatar.component';
import { DesktopFooterComponent } from "../../../shared/components/desktop-footer/desktop-footer.component";
import { MatchMediaService } from '../../../shared/services/match-media.service';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-register',
    standalone: true,
    templateUrl: './register.component.html',
    styleUrl: './register.component.scss',
    imports: [
        MatCardModule,
        MatDialogModule,
        MatDialogContent,
        MatDialogActions,
        MatButtonModule,
        MatInputModule,
        MatFormFieldModule,
        FormsModule,
        MatIconModule,
        RouterLink,
        ChooseAvatarComponent,
        DesktopFooterComponent,
        CommonModule
    ]
})
export class RegisterComponent implements OnInit{
  
  showAvatarComponent:boolean = false;
  isDesktop: boolean = false;
  matchMedia = inject(MatchMediaService);

  contactData = {
    name: '',
    email: '',
    password: '',
    photoURL: ''
  };
  
  router = inject(Router);
  errorMessage: string | null = null;
  updateContactData: any;

  ngOnInit(): void {
    this.isDesktop = this.matchMedia.checkIsDesktop();
  }

  onSubmit(): void {    
    if (this.contactData.name && this.contactData.email && this.contactData.password) {      
      this.showAvatarComponent = true
    }
  }
}
