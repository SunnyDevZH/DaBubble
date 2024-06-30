import { HttpClient } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
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
@Component({
  selector: 'app-reset-password',
  standalone: true,
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
  ],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss',
})
export class ResetPasswordComponent implements OnInit {
  contactData = {
    password: '',
    confirm_password: '',
  };

  http = inject(HttpClient);
  authService = inject(AuthService);
  router = inject(Router);
  errorMessage: string | null = null;
  oobCode: string | undefined;
  isDisabled: boolean = true;
  passwordMinLength: number = 6;
  confirm: boolean = false;

  constructor(private route: ActivatedRoute) {}

  checkPasswords() {
    this.isDisabled =
      this.contactData.password.length >= this.passwordMinLength &&
      this.contactData.password === this.contactData.confirm_password
        ? false
        : true;
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.oobCode = params['oobCode'];
    });
  }

  onSubmit(): void {
    this.confirm = true;
    setTimeout(() => {
      if (this.oobCode) {
        this.authService.resetPassword(this.oobCode, this.contactData.password);
      }
    }, 3500);
  }
}
