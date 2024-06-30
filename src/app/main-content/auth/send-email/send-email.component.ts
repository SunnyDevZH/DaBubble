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
import { DesktopFooterComponent } from "../../../shared/components/desktop-footer/desktop-footer.component";
import { MatchMediaService } from '../../../shared/services/match-media.service';

@Component({
    selector: 'app-send-email',
    standalone: true,
    templateUrl: './send-email.component.html',
    styleUrl: './send-email.component.scss',
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
        DesktopFooterComponent
    ]
})
export class SendEmailComponent implements OnInit{
  contactData = {
    email: '',
  };

  http = inject(HttpClient);
  authService = inject(AuthService);
  router = inject(Router);
  confirm: boolean = false;
  isDesktop: boolean = false;
  matchMedia = inject(MatchMediaService);
  
  ngOnInit(): void {
    this.isDesktop = this.matchMedia.checkIsDesktop();
  }

  onSubmit(): void {
    this.confirm = true;    
    this.authService.sendMailToResetPassword(this.contactData.email);

    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 3500);
  }
}
