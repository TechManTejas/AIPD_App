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
  server: {
    androidScheme: "http",
    allowNavigation: [
      "http://13.232.102.80:8000"
    ]
  }
};

export default config;
