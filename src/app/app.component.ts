import {Component, OnInit, inject, ViewEncapsulation, OnDestroy} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { LogInComponent } from './main-content/auth/log-in/log-in.component';
import { HeaderMobileComponent } from './shared/components/header-mobile/header-mobile.component';
import { MainContentComponent } from './main-content/main-content.component';
import { AuthService } from './shared/services/auth.service';
import { FirestoreService } from './shared/services/firestore.service';
import { DesktopHeadlineComponent } from "./shared/components/desktop-headline/desktop-headline.component";
import { DesktopContentComponent } from "./shared/components/desktop-content/desktop-content.component";
import { MatchMediaService } from './shared/services/match-media.service';

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    encapsulation: ViewEncapsulation.None,
    imports: [
        CommonModule,
        RouterOutlet,
        LogInComponent,
        HeaderMobileComponent,
        MainContentComponent,
        DesktopHeadlineComponent,
        DesktopContentComponent,
    ]
})
export class AppComponent implements OnInit, OnDestroy {

  title = 'dabubble';
  authService = inject(AuthService);
  firestore = inject(FirestoreService);
  matchMedia = inject(MatchMediaService);
  isMobileLandscapeOrientation: boolean = false;
  isDesktop: boolean = false;
  isLoggedIn: boolean = false;

  constructor(private matchMediaService: MatchMediaService) {}

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      if(user){
        this.authService.currentUserSig.set({
          email: user.email!,
          username: user.displayName!,
        });
        this.isLoggedIn = true;
      } else {
        this.authService.currentUserSig.set(null);
        this.isLoggedIn = false;
      }
    })

    window.addEventListener('resize', this.onResize.bind(this));
    this.onResize(); // Initial check when component mounts
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.onResize.bind(this));
  }

  onResize(event?: UIEvent): void {
    this.isMobileLandscapeOrientation = this.matchMedia.checkIsMobileOrientation();
    this.isDesktop = this.matchMedia.checkIsDesktop();
  }
}
