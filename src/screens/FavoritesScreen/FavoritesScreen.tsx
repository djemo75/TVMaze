import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  ListRenderItem,
} from 'react-native';
import {Colors} from '../../constants/colors';
import {useFavorites} from '../../hooks/useFavorites';
import {useIsFocused} from '@react-navigation/native';
import {Show} from '../../types/show';
import {getShowDetails} from '../../services/show';
import {useToast} from '../../context/toastContext';
import {ShowsListItem} from '../../components/ShowsListItem';

export const FavoritesScreen = () => {
  const isFocused = useIsFocused();
  const {showToast} = useToast();
  const {showIds, getFavoriteShows} = useFavorites();
  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isFocused) {
      getFavoriteShows();
    }
  }, [isFocused, getFavoriteShows]);

  const loadShows = useCallback(async () => {
    try {
      setLoading(true);
      const promises = showIds.map(showId => getShowDetails(showId.toString()));
      const data = await Promise.all(promises);

      setShows(data.map(response => response.data));
    } catch (error) {
      showToast({
        type: 'error',
        text: 'An error occurred while retrieving favorites list',
      });
    } finally {
      setLoading(false);
    }
  }, [showIds, showToast]);

  useEffect(() => {
    loadShows();
  }, [loadShows]);

  const renderItem: ListRenderItem<Show> = ({item}) => {
    return <ShowsListItem data={item} />;
  };

  return (
    <View style={styles.root}>
      <Text style={styles.screenTitle}>Favorite shows ({showIds.length})</Text>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator />
        </View>
      ) : (
        <View style={styles.listContainer}>
          {shows.length ? (
            <FlatList
              data={shows}
              renderItem={renderItem}
              keyExtractor={item => item.id.toString()}
            />
          ) : (
            <Text style={styles.noFavoritesText}>
              Add your favorite series so you can easily access them later from
              this screen.
            </Text>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    padding: 20,
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
