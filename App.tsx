import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {StatusBar} from 'react-native';

import {HomeScreen} from './src/screens/HomeScreen/HomeScreen';
import {ShowDetailsScreen} from './src/screens/ShowDetailsScreen/ShowDetailsScreen';
import {Colors} from './src/constants/colors';
import {ToastContextProvider} from './src/context/toastContext';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {BadInternetConnectionNotifier} from './src/components/BadInternetConnectionNotifier';

export type RootStackParamList = {
  home: undefined;
  showDetails: {id: string};
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function App(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <ToastContextProvider>
        <NavigationContainer>
          <StatusBar
            barStyle="light-content"
            backgroundColor={Colors.primary}
          />
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
            }}>
            <Stack.Screen name="home" component={HomeScreen} />
            <Stack.Screen
              name="showDetails"
              component={ShowDetailsScreen}
              options={{
                title: '',
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
        <BadInternetConnectionNotifier />
      </ToastContextProvider>
    </SafeAreaProvider>
  );
}

export default App;
