import { Component, inject, Inject, OnDestroy, OnInit } from "@angular/core";
import {
    MatCard,
    MatCardActions,
    MatCardContent,
    MatCardImage,
} from "@angular/material/card";
import { CommonModule, NgOptimizedImage } from "@angular/common";
import {
    MAT_DIALOG_DATA,
    MatDialog,
    MatDialogRef,
} from "@angular/material/dialog"; // Import MatDialog
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButton } from "@angular/material/button";
import { User } from "../../../../models/user.class";
import { FirestoreService } from "../../../shared/services/firestore.service";
import { AuthService } from "../../../shared/services/auth.service";
import { ChooseAvatarComponent } from "../../auth/register/choose-avatar/choose-avatar.component";
import { Validators, FormControl } from "@angular/forms";
import { UploadService } from "../../../shared/services/upload.service";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

import { MemberService } from "../../../shared/services/member-service.service";
import { Auth } from "@angular/fire/auth";
// import { AvatarService } from "../../../shared/services/avatar-service.service";
import {
    getAuth,
    updateEmail,
    EmailAuthProvider,
    reauthenticateWithCredential,
    verifyBeforeUpdateEmail,
} from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { VerificationEmailDialogComponent } from "../../../verification-email-dialog/verification-email-dialog.component";

@Component({
    selector: "app-edit-profil-card",
    standalone: true,
    imports: [
        MatCard,
        MatCardContent,
        MatCardImage,
        NgOptimizedImage,
        ReactiveFormsModule,
        FormsModule,
        MatCardActions,
        MatButton,
        CommonModule,
        VerificationEmailDialogComponent
    ],
    templateUrl: "./edit-profil-card.component.html",
    styleUrls: ["./edit-profil-card.component.scss"],
})
export class EditProfilCardComponent implements OnInit, OnDestroy {
    firebaseAuth = inject(Auth);
    authService = inject(AuthService);
    user: User = new User();
    templateIndex: number = 0;
    nameData = { name: "" };
    emailData = { email: "" };
    passwordData = { password: "" };
    namePlaceholder?: string;
    emailPlaceholder?: string;
    inputHasValue = false;
    showPasswordField = false;

    nameControl = new FormControl("", [
        Validators.required,
        Validators.minLength(5),
    ]);

    emailControl = new FormControl("", [
        Validators.required,
        Validators.pattern("[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}"),
    ]);

    passwordControl = new FormControl("", [
        Validators.required,
        Validators.minLength(6),
    ]);

    contactData = {
        name: "",
        email: "",
        password: "",
        photoURL: "",
    };

    selectedAvatar: FileList | undefined;
    file: any = undefined;
    filedate: number | undefined;
    errorMessage: string | null = null;
    fileType: string = "";
    maxSizeReached: boolean = false;
    currentUser: string = "";
    auth = getAuth();

    constructor(
        private firestore: FirestoreService,
        public dialogRef: MatDialogRef<EditProfilCardComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { user: User },
        private uploadService: UploadService,
        public dialog: MatDialog, // Add MatDialog as a property
        private memberService: MemberService // private avatarService: AvatarService
    ) {}

    trackByFn(index: number, item: any) {
        return index; // or item.id
    }

    updateMemberAvatar(newAvatarUrl: string) {
        this.memberService.updateMemberAvatar(
            this.authService.activeUserAccount.uid,
            newAvatarUrl
        );
    }

    onEmailChange(value: string): void {
        this.showPasswordField = value !== this.data.user.email;
    }

    async updateEmailForUser() {
      const user = this.getCurrentUser();
      if (!user) return;
  
      if (this.emailControl.valid && this.passwordControl.valid) {
          const newEmail = this.emailControl.value;
          const currentPassword = this.passwordData.password;
          if (newEmail && currentPassword) {
              await this.handleEmailUpdate(user, newEmail, currentPassword);
          }
      }
  }
  
  getCurrentUser() {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) {
          console.log("No user is signed in.");
          return null;
      }
      return user;
  }
  
  async handleEmailUpdate(user: any, newEmail: string, currentPassword: string) {
      const email = user.email;
      localStorage.setItem("newEmail", newEmail);
      try {
          const credentials = EmailAuthProvider.credential(email!, currentPassword);
          await reauthenticateWithCredential(user, credentials);
          await verifyBeforeUpdateEmail(user, newEmail, { url: window.location.href });
          this.dialog.open(VerificationEmailDialogComponent);
      } catch (error: any) {
          console.error("Error updating email:", error.code, error.message);
          alert(`Error: ${error.message}`);
      } finally {
          localStorage.removeItem("newEmail");
      }
  }

    onNoClick(): void {
        this.dialogRef.close();
    }

    checkInput(value: string): void {
        this.inputHasValue = !!value.trim();
    }

    closeEditProfilCard() {
        this.dialogRef.close();
    }

    onFocus() {
        this.namePlaceholder = "";
        this.emailPlaceholder = "";
    }

    ngOnInit() {
        this.firestore.subUserList(); // Abonniere die Benutzerliste

        this.nameData.name = this.data.user.displayName || "";
        this.emailData.email = this.data.user.email || "";
    }

    ngOnDestroy() {
        this.firestore.unsubUsers(); // Beende das Abonnement
    }

    saveProfile(): void {
        if (this.nameControl.valid && this.emailControl.valid) {
            this.data.user.displayName =
                this.nameData.name || this.data.user.displayName;
            this.data.user.email = this.emailData.email || this.data.user.email;

            this.firestore
                .updateUser(
                    this.data.user,
                    this.authService.activeUserAccount.uid
                )
                .then(() => {
                    this.dialogRef.close();
                })
                .catch((error) => {
                    console.error(
                        "Fehler beim Aktualisieren des Profils:",
                        error
                    );
                });

            if (this.firebaseAuth.currentUser?.photoURL) {
                this.authService.updateUserData(
                    this.nameData.name,
                    this.firebaseAuth.currentUser.photoURL
                );
            }

            this.updateEmailForUser();
        }
    }

    openAvatarDialog(): void {
        this.dialog.open(ChooseAvatarComponent, {
            width: "80%",
            data: { user: this.contactData },
        });
    }

    uploadSingleFile2() {
        if (this.selectedAvatar) {
            this.file = this.selectedAvatar.item(0);

            if (this.file?.size && this.file?.size <= 500000) {
                this.maxSizeReached = false;
                this.filedate = new Date().getTime();
                this.fileType = this.file.type;
                this.uploadService
                    .uploadFile(this.file, this.filedate, "character")
                    .then((url: string) => {
                        this.updateAuthService(url);
                        this.data.user.avatar = url;
                        this.authService.activeUserAccount.photoURL = url;
                        this.updateMemberAvatar(url);
                    })
                    .catch((error) => {
                        this.errorMessage = error.code;
                    });
            } else {
                this.maxSizeReached = true;
            }
        }
    }

    updateAuthService(url: string) {
        this.authService.updateUserData(this.user.displayName!, url);
    }

    detectAvatar(event: any) {
        this.selectedAvatar = event.target.files;
        this.uploadSingleFile2();
    }

    setAvatar(event: any) {
        this.data.user.avatar = event.target.src;
        this.updateAuthService(event.target.src);
    }
}
