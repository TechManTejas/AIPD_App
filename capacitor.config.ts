import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.technopolis.aipd',
  // linuxAndroidStudioPath: "/snap/android-s tudio/current/android-studio/bin/studio.sh",
  appName: 'APID',
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
  server: {
    androidScheme: "http",
    allowNavigation: [
      "http://192.168.1.11:5000"
    ]
  }
};

export default config;
