The project is bootstrapped using [`@react-native-community/cli`](https://github.com/react-native-community/cli).

# Getting Started

>**Note**: Make sure you have completed the [React Native - Environment Setup](https://reactnative.dev/docs/environment-setup) instructions till "Creating a new application" step, before proceeding.

## Step 1: Configure environment variables

First, you will need to create an **.env** and put the following credentials as content:

```bash
REACT_APP_TV_MAZE_API_URL=https://api.tvmaze.com
```

## Step 2: Install dependencies and CocoaPods

The required libraries used in the project must be installed using the commands:

```bash
# using npm
npm install

# OR using Yarn
yarn install
```

### For iOS

```bash
# Install CocoaPods
npx pod-install

```

## Step 3: Start the Metro Server

As a next step, you will need to start **Metro**, the JavaScript _bundler_ that ships _with_ React Native.

To start Metro, run the following command from the _root_ of your React Native project:

```bash
# using npm
npm start

# OR using Yarn
yarn start
```

## Step 4: Start your Application

Let Metro Bundler run in its _own_ terminal. Open a _new_ terminal from the _root_ of your React Native project. Run the following command to start your _Android_ or _iOS_ app:

### For Android

```bash
# using npm
npm run android

# OR using Yarn
yarn android
```

### For iOS

```bash
# using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up _correctly_, you should see your new app running in your _Android Emulator_ or _iOS Simulator_ shortly provided you have set up your emulator/simulator correctly.

This is one way to run your app — you can also run it directly from within Android Studio and Xcode respectively.

# Troubleshooting

If you can't get this to work, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

# Screenshots

<div style="display: "flex">
<img src="https://i.ibb.co/dDWX4v4/Simulator-Screen-Shot-i-Phone-13-Pro-2024-02-09-at-17-17-42.png" alt="home" width="200"/>
<img src="https://i.ibb.co/VYxfphm/Simulator-Screen-Shot-i-Phone-13-Pro-2024-02-09-at-17-25-30.png" alt="home" width="200"/>
<img src="https://i.ibb.co/0jJ5jN4/Simulator-Screen-Shot-i-Phone-13-Pro-2024-02-08-at-20-12-22.png" alt="show-details" width="200"/>
<img src="https://i.ibb.co/gFdn88R/Simulator-Screen-Shot-i-Phone-13-Pro-2024-02-09-at-17-26-12.png" alt="favorites" width="200"/>
</div>
<div style="display: "flex">
<img src="https://i.ibb.co/chc0sNv/Simulator-Screen-Shot-i-Phone-13-Pro-2024-02-08-at-20-20-49.png" alt="bad-connection-toast" width="200"/>
<img src="https://i.ibb.co/PFrdHKg/Simulator-Screen-Shot-i-Phone-13-Pro-2024-02-08-at-20-23-21.png" alt="error-handling-toast" width="200"/>
</div>

