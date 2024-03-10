# mobile

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

For running in the iOS simulator (debug build):

```
detox build --configuration ios.sim.debug
detox test --configuration ios.sim.debug
```
