import { ApplicationConfig, provideZoneChangeDetection, } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';


const firebaseConfig = {
    apiKey: "AIzaSyC3EN2u_4Kh0erudI0KVjCLIDYjOeVZRMA",
    authDomain: "todolist-dd296.firebaseapp.com",
    projectId: "todolist-dd296",
    storageBucket: "todolist-dd296.appspot.com",
    messagingSenderId: "365314597189",
    appId: "1:365314597189:web:7a07c5106d79af3ff39e2c",
};


export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideClientHydration(),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideFirestore(() => getFirestore()),
  ],
};
