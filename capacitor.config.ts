import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.technopolis.aipd',
  // linuxAndroidStudioPath: "/snap/android-s tudio/current/android-studio/bin/studio.sh",
  appName: 'TherapEZ',
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
    url:"https://bharatsiksha.com/",
    androidScheme: "https"
  }
};

export default config;
