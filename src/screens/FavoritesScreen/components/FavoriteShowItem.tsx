import React, {useCallback, useEffect, useState} from 'react';
import {ActivityIndicator} from 'react-native';

import {isAxiosError} from 'axios';

import {ShowsListItem} from '../../../components/ShowsListItem';
import {useToast} from '../../../context/toastContext';
import {usePersistanceStore} from '../../../hooks/usePersistanceStore';
import {getShowDetails} from '../../../services/show';
import {Show} from '../../../types/show';

type Props = {
  showId: Show['id'];
};

export const FavoriteShowItem = ({showId}: Props) => {
  const {showToast} = useToast();
  const {get: getFromPersistanceStore, set: setInPersistanceStore} =
    usePersistanceStore();
  const [show, setShow] = useState<Show>();
  const [loading, setLoading] = useState<boolean>();

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const cacheKey = `shows/${showId}`;
      let data = await getFromPersistanceStore<Show>(cacheKey);
      if (!data) {
        const res = await getShowDetails(showId.toString());
        data = res.data;
        await setInPersistanceStore(cacheKey, data);
      }
      setShow(data);
    } catch (error) {
      let message = 'An error occurred while retrieving the show';
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
  }, [showId, showToast, getFromPersistanceStore, setInPersistanceStore]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (loading) {
    return <ActivityIndicator />;
  }

  if (!show) {
    return null;
  }

  return <ShowsListItem data={show} />;
};
