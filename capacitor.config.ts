import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  // linuxAndroidStudioPath: "/snap/android-s tudio/current/android-studio/bin/studio.sh",
  appName: 'APID_App',
  webDir: 'build',
  bundledWebRuntime: false,
  plugins: {
    Camera: {
      permissions: [
        "camera",
        "microphone"
      ]
    }
  },
  
};

export default config;
