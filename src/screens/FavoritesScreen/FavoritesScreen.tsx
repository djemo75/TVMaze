import React, {useEffect} from 'react';
import {FlatList, ListRenderItem, StyleSheet, Text, View} from 'react-native';

import {useIsFocused} from '@react-navigation/native';

import {FavoriteShowItem} from './components/FavoriteShowItem';
import {StackScreenSafeArea} from '../../components/StackScreenSafeArea';
import {Colors} from '../../constants/colors';
import {useFavorites} from '../../hooks/useFavorites';

export const FavoritesScreen = () => {
  const isFocused = useIsFocused();
  const {showIds, getFavoriteShows} = useFavorites();

  useEffect(() => {
    if (isFocused) {
      getFavoriteShows();
    }
  }, [isFocused, getFavoriteShows]);

  const renderItem: ListRenderItem<number> = ({item}) => {
    return <FavoriteShowItem showId={item} />;
  };

  return (
    <StackScreenSafeArea>
      <View style={styles.root}>
        <Text style={styles.screenTitle}>
          Favorite shows ({showIds.length})
        </Text>

        <View style={styles.listContainer}>
          {showIds.length ? (
            <FlatList
              data={showIds}
              renderItem={renderItem}
              keyExtractor={item => item.toString()}
            />
          ) : (
            <Text style={styles.noFavoritesText}>
              Add your favorite series so you can easily access them later from
              this screen.
            </Text>
          )}
        </View>
      </View>
    </StackScreenSafeArea>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    padding: 20,
    paddingBottom: 0,
  },
  screenTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: Colors.black,
  },
  loadingContainer: {
    justifyContent: 'center',
    marginTop: 20,
  },
  listContainer: {
    flex: 1,
    marginTop: 12,
  },
  noFavoritesText: {
    textAlign: 'center',
    color: Colors.primary,
  },
});
