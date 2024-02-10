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