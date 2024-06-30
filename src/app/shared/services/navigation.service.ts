import { Injectable } from '@angular/core';
import {Router} from '@angular/router'
import { Location } from '@angular/common';
@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  constructor(private location: Location, private router: Router) {}

  goBack(): void {
    this.location.back();
  }

  navigate(path: string | string[]): void {
    this.router.navigate(Array.isArray(path) ? path : [path]);
  }
}
