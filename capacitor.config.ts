import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.ayigotech.welfaremanager',
  appName: 'Welfare Manager',
  webDir: 'www',
  server: {
    androidScheme: 'https'
    
  },
   plugins: {
    Preferences: {
      group: 'com.welfare.manager.preferences'
    },
   SplashScreen: {
      launchShowDuration: 0,        // Show for 0ms - hide immediately
      launchAutoHide: true,         // Auto hide
      backgroundColor: "#Ffff",   // Use your primary color
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true,
    }
  }
};

export default config;
