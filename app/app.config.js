const PROJECT_ID = 'd1f8338a-af50-4ef9-a163-c33d6ace8037';
const PRODUCTION_BUNDLE_ID = 'com.sayyer.kashikarimap';
const SHARED_ADHOC_BUNDLE_ID = 'com.brunostudio.adhocpreview';

const buildProfile = process.env.EAS_BUILD_PROFILE || process.env.APP_VARIANT || 'development';
const isProduction = buildProfile === 'production';
const isSharedAdHoc = !isProduction;

/** @type {import('expo/config').ExpoConfig} */
module.exports = {
  name: isSharedAdHoc ? 'Sayyer AdHoc' : '貸し借りマップ',
  slug: 'kashikari-map',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: isSharedAdHoc ? 'sayyer-adhoc' : 'kashikari-map',
  userInterfaceStyle: 'automatic',
  ios: {
    supportsTablet: true,
    bundleIdentifier: isSharedAdHoc ? SHARED_ADHOC_BUNDLE_ID : PRODUCTION_BUNDLE_ID,
    infoPlist: {
      ITSAppUsesNonExemptEncryption: false,
    },
  },
  android: {
    package: PRODUCTION_BUNDLE_ID,
    adaptiveIcon: {
      backgroundColor: '#E6F4FE',
      foregroundImage: './assets/images/android-icon-foreground.png',
      backgroundImage: './assets/images/android-icon-background.png',
      monochromeImage: './assets/images/android-icon-monochrome.png',
    },
    predictiveBackGestureEnabled: false,
  },
  web: {
    bundler: 'metro',
    output: 'static',
    favicon: './assets/images/favicon.png',
  },
  plugins: [
    'expo-router',
    [
      'expo-splash-screen',
      {
        image: './assets/images/splash-icon.png',
        resizeMode: 'contain',
        backgroundColor: '#ffffff',
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
  },
  extra: {
    router: {},
    eas: {
      projectId: PROJECT_ID,
    },
    buildProfile,
    appVariant: isSharedAdHoc ? 'shared-adhoc' : 'production',
  },
  owner: 'sayyer',
  runtimeVersion: {
    policy: 'appVersion',
  },
  updates: {
    url: `https://u.expo.dev/${PROJECT_ID}`,
  },
};
