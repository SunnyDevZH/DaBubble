import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { firebaseConfig } from './environment';
import { HttpClientModule } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes), 
    provideAnimationsAsync(),
    importProvidersFrom(
      HttpClientModule,
      provideFirebaseApp(() => 
      initializeApp(
        {
          "projectId": firebaseConfig.projectId,
          "appId": firebaseConfig.appId,
          "storageBucket":firebaseConfig.storageBucket,
          "apiKey": firebaseConfig.apiKey,
          "authDomain":firebaseConfig.authDomain,
          "messagingSenderId":firebaseConfig.messagingSenderId,
        }
      )
      )
    ),
    importProvidersFrom(provideAuth(() => getAuth())), importProvidersFrom(provideFirestore(() => getFirestore())), importProvidersFrom(provideStorage(() => getStorage())), provideAnimationsAsync()]
};
