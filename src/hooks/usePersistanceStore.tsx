import {useCallback} from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';

import {useToast} from '../context/toastContext';

type Cache = {
  timestamp: number;
  data: Object;
};

type PersistanceStore = Record<string, Cache>;

const storageKey = 'persistance-store';

export const usePersistanceStore = () => {
  const {showToast} = useToast();

  const getAllData = useCallback(async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(storageKey);
      if (jsonValue !== null) {
        return JSON.parse(jsonValue) as PersistanceStore;
      }
      return null;
    } catch (e) {
      showToast({
        type: 'error',
        text: 'An error occurred while getting data from persistance store',
      });
      return null;
    }
  }, [showToast]);

  const set = useCallback(
    async (key: string, data: Object) => {
      try {
        const allData = (await getAllData()) || {};
        allData[key] = {data: data, timestamp: new Date().getTime()};
        await AsyncStorage.setItem(storageKey, JSON.stringify(allData));
      } catch (e) {
        showToast({
          type: 'error',
          text: 'An error occurred while setting data in persistance store',
        });
      }
    },
    [showToast, getAllData],
  );

  const remove = useCallback(
    async (key: keyof PersistanceStore) => {
      try {
        const allData = await getAllData();
        if (allData) {
          delete allData[key];
          await AsyncStorage.setItem(storageKey, JSON.stringify(allData));
        }
      } catch (e) {
        showToast({
          type: 'error',
          text: 'An error occurred while removing data from persistance store',
        });
      }
    },
    [showToast, getAllData],
  );

  const get = useCallback(
    async <T extends Object>(key: keyof PersistanceStore) => {
      try {
        const allData = await getAllData();
        if (allData) {
          const cache = allData[key] as Cache;
          if (cache) {
            if (isCacheFresh(cache.timestamp)) {
              return cache.data as T;
            } else {
              remove(key);
            }
          }
        }
        return null;
      } catch (e) {
        showToast({
          type: 'error',
          text: 'An error occurred while getting data from persistance store',
        });
        return null;
      }
    },
    [showToast, getAllData, remove],
  );

  const isCacheFresh = (timestamp: number) => {
    const timestampNow = new Date().getTime();
    const validityThreshold = 1 * 60 * 1000; // 5min

    return timestampNow - timestamp < validityThreshold;
  };

  return {set, getAllData, get, remove};
};
