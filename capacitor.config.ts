import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.jpromi.ausgsteckt',
  appName: 'Ausgsteckt Is',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
