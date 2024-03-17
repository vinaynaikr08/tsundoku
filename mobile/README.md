# mobile

[![Mobile iOS Tests](https://github.com/Purdue-CS307-tsundoku/tsundoku/actions/workflows/mobile-ios-tests.yml/badge.svg)](https://github.com/Purdue-CS307-tsundoku/tsundoku/actions/workflows/mobile-ios-tests.yml)
[![Mobile Android Tests](https://github.com/Purdue-CS307-tsundoku/tsundoku/actions/workflows/mobile-android-tests.yml/badge.svg)](https://github.com/Purdue-CS307-tsundoku/tsundoku/actions/workflows/mobile-android-tests.yml)

Android/iOS app written in React Native (Expo)

## Building

Note: on macOS and Linux, watchman is required to prevent the file handle exhaustion. Run:

```
brew update
brew install watchman
```

To build:

```
npm install
npx expo start
```

## Creating a new component

```
npx new-component -l ts -d Components <Component name>
```

For example:

```
npx new-component -l ts -d Components Button
```

## Testing

Note: to use the iOS simulator, `applesimutils` must be installed.

```
brew tap wix/brew
brew install applesimutils
```

Before running the tests, you should run an Expo `prebuild` so that the native source code is generated:

```
npx expo prebuild
```

For Android, you may then have to open the `./android` subdirectory in Android Studio so that `gradlew` and the necessary dependencies are installed.

Before running the tests, make sure you run the Expo server in a separate terminal window so that Detox can connect to it.

For running in the iOS simulator (debug build):

```
detox build --configuration ios.sim.debug
detox test --configuration ios.sim.debug
```

For running on Android (debug build):

```
detox build --configuration android.emu.debug
detox test --configuration android.emu.debug
```

### Troubleshooting

#### When running `detox build`, I get an Xcode error.

- Make sure you have installed all updates for your Mac.
  - In System Settings, make sure you do not have any system updates. If you do, install all of them.
  - In the App Store, make sure you do not have any updates for Xcode. If you do, install it.
- Launch Xcode and agree to the terms and conditions.
- Xcode will prompt you to install the runtimes and simulators. Make sure the "iOS" platform is selected, and click "Install"

Then try running the commands again.
