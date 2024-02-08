import {useCallback, useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {Show} from '../types/show';
import {useToast} from '../context/toastContext';

const storageKey = 'favorite-shows';

export const useFavorites = () => {
  const {showToast} = useToast();
  const [showIds, setShowIds] = useState<Show['id'][]>([]);

  const getFavoriteShows = useCallback(async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(storageKey);
      if (jsonValue !== null) {
        const newShowIds = JSON.parse(jsonValue);
        setShowIds(newShowIds);
      }
    } catch (e) {
      showToast({
        type: 'error',
        text: 'An error occurred while syncing favorites list',
      });
    }
  }, [showToast]);

  useEffect(() => {
    getFavoriteShows();
  }, [getFavoriteShows]);

  const addShowToFavorites = async (showId: Show['id']) => {
    try {
      const newShowIds = showIds.concat(showId);
      const jsonValue = JSON.stringify(newShowIds);
      await AsyncStorage.setItem(storageKey, jsonValue);
      setShowIds(newShowIds);
    } catch (e) {
      showToast({
        type: 'error',
        text: 'An error occurred while adding the show to favorites list',
      });
    }
  };

  const removeShowFromFavorites = async (showId: Show['id']) => {
    try {
      const newShowIds = showIds.filter(id => id !== showId);
      const jsonValue = JSON.stringify(newShowIds);
      await AsyncStorage.setItem(storageKey, jsonValue);
      setShowIds(newShowIds);
    } catch (e) {
      showToast({
        type: 'error',
        text: 'An error occurred while adding the show to favorites list',
      });
    }
  };

  return {
    showIds,
    addShowToFavorites,
    removeShowFromFavorites,
    getFavoriteShows,
  };
};
