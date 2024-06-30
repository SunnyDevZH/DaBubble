import {ChangeDetectorRef, Component, ElementRef, inject, Input, OnInit, ViewChild} from '@angular/core';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {BottomSheetComponent} from '../bottom-sheet/bottom-sheet.component';
import {AuthService} from '../../services/auth.service';
import {FirestoreService} from '../../services/firestore.service';
import {User} from '../../../../models/user.class';
import {CommonModule, Location} from '@angular/common';
import {HeaderStateService} from '../../services/header-state.service';
import {Router} from '@angular/router';
import {DesktopOverlayComponent} from '../desktop-overlay/desktop-overlay.component';
import { MatchMediaService } from '../../services/match-media.service';

@Component({
  selector: 'app-header-mobile',
  standalone: true,
  imports: [BottomSheetComponent, CommonModule, DesktopOverlayComponent],
  templateUrl: './header-mobile.component.html',
  styleUrl: './header-mobile.component.scss',
})
export class HeaderMobileComponent implements OnInit {
  firestore = inject(FirestoreService);
  authService = inject(AuthService);
  matchMedia = inject(MatchMediaService);
  user: User = new User();
  @Input() alternativeHeader: boolean = false;
  @Input() isDesktop: boolean = false;
  hoverBack: boolean = false;
  overlayVisible = false;
  defaultImage: string = 'assets/img/icon/keyboard_arrow_down.svg';
  hoverImage: string = 'assets/img/icon/keyboard_arrow_down_color.svg';
  currentImage: string = this.defaultImage;

  constructor(private _bottomSheet: MatBottomSheet,
              private headerStateService: HeaderStateService,
              private _location: Location, private router: Router,
              private cd: ChangeDetectorRef) {
  }

  async ngOnInit(): Promise<void> {
    await this.waitForUserData();
    this.test();

    this.headerStateService.alternativeHeader$.subscribe(value => {
      this.alternativeHeader = value;
    });
  }

  async waitForUserData(): Promise<void> {
    while (!this.authService.activeUserAccount) {
      await this.delay(100); // Wartezeit in Millisekunden, bevor erneut überprüft wird
    }
  }

  delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  test() {
    let id = this.authService.activeUserAccount.uid;
    //console.log(id); // Stelle sicher, dass id definiert ist, bevor du darauf zugreifst
    this.getItemValues('users', id);
  }

  openBottomSheet(): void {
    if (!this.isDesktop) {
      const bottomSheetRef = this._bottomSheet.open(BottomSheetComponent, {
        data: {user: this.user} // Übergabe des Benutzerobjekts an die BottomSheet
      });

      bottomSheetRef.afterDismissed().subscribe(result => {
        // console.log('Bottom Sheet closed', result);
        // Hier kannst du weitere Aktionen ausführen, nachdem die Bottom Sheet geschlossen wurde
      });
    }
  }

  getItemValues(collection: string, itemID: string) {
    this.firestore.getSingleItemData(collection, itemID, () => {
      this.user = new User(this.firestore.user);
    });
  }

  onBack(): void {
    // this.router.navigate(['/']);
    this.matchMedia.scrollToBottom = true;
    this.matchMedia.scrollToBottomThread = true;
    this.router.navigate(['/main']);
    this.headerStateService.setAlternativeHeader(false);
  }

  openOverlay(): void {
    if (this.isDesktop) {
      this.overlayVisible = !this.overlayVisible;      
    }
  }

  closeOverlay(): void {
    this.overlayVisible = false; // Hier definieren wir die closeOverlay Methode
    // console.log('overlayVisible:', this.overlayVisible);
    this.cd.detectChanges(); // Manually trigger change detection
  }
}
