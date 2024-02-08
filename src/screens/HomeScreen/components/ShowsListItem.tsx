import React from 'react';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import {Show} from '../../../types/show';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {Colors} from '../../../constants/colors';
import {RootStackParamList} from '../../../../App';

type Props = {
  data: Show;
};

export const ShowsListItem = ({data}: Props) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const handleView = () => {
    navigation.navigate('showDetails', {
      id: data.id.toString(),
    });
  };

  return (
    <Pressable onPress={handleView}>
      <View style={styles.root}>
        {data.image ? (
          <Image source={{uri: data.image.medium}} style={styles.image} />
        ) : (
          <View style={styles.image}>
            <Text style={styles.noImageText}>No Image</Text>
          </View>
        )}
        <View style={styles.infoContainer}>
          <Text style={styles.name}>{data.name}</Text>
          <Text style={styles.genres} numberOfLines={1}>
            {data.genres?.length ? data.genres?.join(', ') : 'No genre'}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  root: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 20,
  },
  image: {
    width: 100,
    height: 100,
    objectFit: 'cover',
    borderRadius: 8,
    backgroundColor: Colors.primary,
    marginRight: 12,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noImageText: {
    color: Colors.white,
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: '500',
    color: Colors.black,
    marginBottom: 8,
  },
  genres: {
    color: '#808080',
  },
});
