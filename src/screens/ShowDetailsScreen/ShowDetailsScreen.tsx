import React, {useCallback, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Button,
  Image,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {useNetInfo} from '@react-native-community/netinfo';
import {
  NavigationProp,
  RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {isAxiosError} from 'axios';

import {RootStackParamList} from '../../../App';
import {StackScreenSafeArea} from '../../components/StackScreenSafeArea';
import {Colors} from '../../constants/colors';
import {useToast} from '../../context/toastContext';
import {useFavorites} from '../../hooks/useFavorites';
import {usePersistanceStore} from '../../hooks/usePersistanceStore';
import {getShowDetails} from '../../services/show';
import {Show} from '../../types/show';
import {removeHtmlFromString} from '../../utils/removeHtmlFromString';

export const ShowDetailsScreen = () => {
  const route = useRoute<RouteProp<RootStackParamList>>();
  const navigate = useNavigation<NavigationProp<RootStackParamList>>();
  const {isConnected} = useNetInfo();
  const {showToast} = useToast();
  const {get: getFromPersistanceStore, set: setInPersistanceStore} =
    usePersistanceStore();
  const {
    showIds: favoriteShowIds,
    addShowToFavorites,
    removeShowFromFavorites,
  } = useFavorites();
  const [details, setDetails] = useState<Show>();
  const [loading, setLoading] = useState<boolean>();

  const loadData = useCallback(async () => {
    if (!route.params || !route.params.id) {
      navigate.navigate('home');
      return;
    }
    try {
      setLoading(true);
      const cacheKey = `shows/${route.params.id}`;
      let data = await getFromPersistanceStore<Show>(
        cacheKey,
        isConnected === true,
      );
      if (!data && isConnected === true) {
        const res = await getShowDetails(route.params.id);
        data = res.data;
        await setInPersistanceStore(cacheKey, data);
      }

      if (data) {
        setDetails(data);
      } else if (isConnected === false) {
        showToast({
          type: 'info',
          text: 'You currently have no internet connection and no data for this show has been downloaded.',
        });
        navigate.navigate('home');
      }
    } catch (error) {
      let message = 'An error occurred while retrieving the data';
      if (isAxiosError(error)) {
        message = error.message;
      }
      showToast({
        type: 'error',
        text: message,
      });
    } finally {
      setLoading(false);
    }
  }, [
    route.params,
    isConnected,
    navigate,
    showToast,
    getFromPersistanceStore,
    setInPersistanceStore,
  ]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleAddToFavorites = () => {
    if (details) {
      addShowToFavorites(details.id);
    }
  };

  const handleRemoveFromFavorites = () => {
    if (details) {
      removeShowFromFavorites(details.id);
    }
  };

  const handlePressMoreInfo = () => {
    if (details) {
      Linking.openURL(details.url);
    }
  };

  const isAddedToFavoritesList = details
    ? favoriteShowIds.includes(details.id)
    : false;

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <StackScreenSafeArea>
      <ScrollView style={styles.root}>
        {details && (
          <View style={styles.innerContainer}>
            {details.image ? (
              <Image
                source={{uri: details.image.original}}
                style={styles.image}
              />
            ) : (
              <View style={styles.image}>
                <Text style={styles.noImageText}>No Image</Text>
              </View>
            )}
            <Text style={styles.name}>{details.name}</Text>
            <Text style={styles.summary}>
              {details.summary ? removeHtmlFromString(details.summary) : ''}
            </Text>

            <Button
              title={
                isAddedToFavoritesList
                  ? 'Remove from favorites'
                  : 'Add to favorites'
              }
              onPress={
                isAddedToFavoritesList
                  ? handleRemoveFromFavorites
                  : handleAddToFavorites
              }
            />

            {details.url && (
              <Pressable
                onPress={handlePressMoreInfo}
                style={({pressed}) => [
                  styles.moreInfoButton,
                  pressed && styles.moreInfoButtonPressed,
                ]}>
                <Text style={styles.moreInfoButtonText}>More info</Text>
              </Pressable>
            )}
          </View>
        )}
      </ScrollView>
    </StackScreenSafeArea>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    padding: 20,
  },
  innerContainer: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    aspectRatio: 1.54,
    objectFit: 'cover',
    borderRadius: 8,
    backgroundColor: Colors.primary,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noImageText: {
    color: Colors.white,
  },
  name: {
    fontSize: 22,
    fontWeight: '500',
    color: Colors.black,
    marginTop: 16,
    marginBottom: 8,
  },
  summary: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.black,
    marginBottom: 32,
  },
  moreInfoButton: {
    backgroundColor: Colors.primary,
    borderRadius: 6,
    padding: 12,
    marginTop: 12,
  },
  moreInfoButtonPressed: {
    opacity: 0.9,
  },
  moreInfoButtonText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
});
