import { Component, Input, OnInit, inject } from '@angular/core';
import { MainContentComponent } from '../../../main-content/main-content.component';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { RouterOutlet } from '@angular/router';
import { ThreadComponent } from "../thread/thread.component";
import { MatchMediaService } from '../../services/match-media.service';
import { Router, RouterLink } from '@angular/router';
@Component({
    selector: 'app-desktop-content',
    standalone: true,
    templateUrl: './desktop-content.component.html',
    styleUrl: './desktop-content.component.scss',
    imports: [
      MainContentComponent, 
      CommonModule, 
      MatCardModule, 
      RouterOutlet,
      RouterLink, 
      ThreadComponent
    ]
})
export class DesktopContentComponent implements OnInit {
  matchMedia = inject(MatchMediaService);
  router = inject(Router);
  isDesktop: boolean = false;
  isCollapsed: boolean = false;
  hovered: boolean = false;

  ngOnInit(): void {
    this.isDesktop = this.matchMedia.checkIsDesktop();
  }

  toggleDiv() {
    this.isCollapsed = !this.isCollapsed;
  }

  deleteHovered(){
    this.hovered = false;
  }

  openNewMessage() {
    this.matchMedia.loading = true;
    this.router.navigateByUrl('/new-message');
  }
}
