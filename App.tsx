import React, {FC, PropsWithChildren} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {StatusBar} from 'react-native';

import {HomeScreen} from './src/screens/HomeScreen/HomeScreen';
import {ShowDetailsScreen} from './src/screens/ShowDetailsScreen/ShowDetailsScreen';
import {Colors} from './src/constants/colors';
import {ToastContextProvider} from './src/context/toastContext';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {BadInternetConnectionNotifier} from './src/components/BadInternetConnectionNotifier';
import {HeaderFavoritesButton} from './src/components/HeaderFavoritesButton';
import {FavoritesScreen} from './src/screens/FavoritesScreen/FavoritesScreen';

export type RootStackParamList = {
  home: undefined;
  showDetails: {id: string};
  favorites: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const TopLevelProviders: FC<PropsWithChildren> = ({children}) => {
  return (
    <SafeAreaProvider>
      <ToastContextProvider>{children}</ToastContextProvider>
    </SafeAreaProvider>
  );
};

function App(): React.JSX.Element {
  return (
    <TopLevelProviders>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            title: 'TVMaze',
            headerStyle: {
              backgroundColor: Colors.primary,
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
            headerRight: HeaderFavoritesButton,
          }}>
          <Stack.Screen name="home" component={HomeScreen} />
          <Stack.Screen
            name="showDetails"
            component={ShowDetailsScreen}
            options={{
              title: '',
            }}
          />
          <Stack.Screen
            name="favorites"
            component={FavoritesScreen}
            options={{
              title: '',
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
      <BadInternetConnectionNotifier />
    </TopLevelProviders>
  );
}

export default App;
