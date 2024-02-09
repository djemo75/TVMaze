import React from 'react';
import {Pressable, StyleSheet, Text} from 'react-native';

import {NavigationProp, useNavigation} from '@react-navigation/native';
import {Colors} from 'react-native/Libraries/NewAppScreen';

import {RootStackParamList} from '../../App';

export const HeaderFavoritesButton = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const handlePress = () => {
    navigation.navigate('favorites');
  };

  return (
    <Pressable
      style={({pressed}) => [styles.button, pressed && styles.buttonPressed]}
      onPress={handlePress}>
      <Text style={styles.text}>Favorites</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 4,
  },
  buttonPressed: {
    opacity: 0.9,
  },
  text: {
    color: Colors.white,
  },
});
