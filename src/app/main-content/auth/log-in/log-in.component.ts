import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
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
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../shared/services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { MatchMediaService } from '../../../shared/services/match-media.service';
import { DesktopFooterComponent } from '../../../shared/components/desktop-footer/desktop-footer.component';

@Component({
  selector: 'app-log-in',
  standalone: true,
  templateUrl: './log-in.component.html',
  styleUrl: './log-in.component.scss',
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
    CommonModule,
    DesktopFooterComponent,
  ],
})
export class LogInComponent implements OnInit {
  contactData = {
    name: '',
    email: '',
    password: '',
  };
  http = inject(HttpClient);
  authService = inject(AuthService);
  matchMedia = inject(MatchMediaService);
  router = inject(Router);
  errorMessage: string | null = null;
  playIntroAnimation: boolean = true;
  isDesktop: boolean = false;

  constructor() {
    setTimeout(() => {
      if (this.authService.activeUserId) {
        this.redirectToMain();
      }
    }, 500);
  }

  ngOnInit(): void {
    this.isDesktop = this.matchMedia.checkIsDesktop();
  }

  onSubmit(): void {
    this.authService
      .login(this.contactData.email, this.contactData.password)
      .subscribe({
        next: () => {
          this.router.navigateByUrl('/main');
        },
        error: (err) => {
          this.errorMessage = err.code;
        },
      });
  }

  logout(): void {
    this.playIntroAnimation = true;
    this.authService.logout();
  }

  signInWithGoogleRedirect() {
    this.authService.googleAuth();
  }

  anonymousLogin() {
    this.authService.signInAnonymous();
  }

  redirectToMain() {
    this.router.navigateByUrl('/main');
  }
}
