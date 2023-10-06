import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'factory',
  webDir: '../../dist/apps/factory',
  bundledWebRuntime: false,
  server: {
    androidScheme: 'https',
  },
};

export default config;
