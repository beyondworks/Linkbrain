/// <reference types="@capacitor-firebase/authentication" />

import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.linkbrain.app',
  appName: 'LinkBrain',
  webDir: 'dist',

  server: {
    androidScheme: 'https',
    allowNavigation: [
      'https://*.firebaseapp.com',
      'https://*.googleapis.com',
      'https://*.google.com',
      'https://*.gstatic.com',
      'https://*.firebase.com',
      'https://*.firebaseio.com',
    ],
  },

  ios: {
    contentInset: 'never',
    preferredContentMode: 'mobile',
    backgroundColor: '#ffffff',
    allowsLinkPreview: false,
  },

  android: {
    backgroundColor: '#ffffff',
    allowMixedContent: true,
    captureInput: true,
    webContentsDebuggingEnabled: true,
  },

  plugins: {
    SplashScreen: {
      launchShowDuration: 0,
      launchAutoHide: true,
      launchFadeOutDuration: 0,
      backgroundColor: '#21DBA4',
      showSpinner: false,
    },
    StatusBar: {
      style: 'dark',
      backgroundColor: '#21DBA4',
    },
    Keyboard: {
      resizeOnFullScreen: true,
    },
    FirebaseAuthentication: {
      skipNativeAuth: true,
      providers: ['google.com'],
    },
  },
};

export default config;
