import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.jpromi.ausgsteckt',
  appName: 'Ausgsteckt Is',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    LocalNotifications: {
      smallIcon: "assets/icons/icon-128x128.png",
      iconColor: "#488AFF",
    },
  }
};

export default config;
