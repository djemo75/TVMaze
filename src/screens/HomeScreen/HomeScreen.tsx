import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  ListRenderItem,
  StyleSheet,
  View,
} from 'react-native';

import {useNetInfo} from '@react-native-community/netinfo';
import {isAxiosError} from 'axios';

import {CustomTextInput} from '../../components/CustomTextInput';
import {ShowsListItem} from '../../components/ShowsListItem';
import {StackScreenSafeArea} from '../../components/StackScreenSafeArea';
import {Colors} from '../../constants/colors';
import {useToast} from '../../context/toastContext';
import {usePersistanceStore} from '../../hooks/usePersistanceStore';
import {getShows, searchShows} from '../../services/show';
import {Show} from '../../types/show';

let timer: NodeJS.Timeout;

const INITIAL_PAGE = 1;

export const HomeScreen = () => {
  const {isConnected} = useNetInfo();
  const {showToast} = useToast();
  const {get: getFromPersistanceStore, set: setInPersistanceStore} =
    usePersistanceStore();
  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchString, setSearchString] = useState<string>('');
  const [page, setPage] = useState<number>(INITIAL_PAGE);
  const [hasNextPage, setHasNextPage] = useState(true);
  const listRef = useRef<FlatList>(null);

  const handleError = useCallback(
    (error: unknown, searchStringValue: string) => {
      setLoading(false);
      let message = searchStringValue
        ? 'An error occurred while searching the show'
        : 'An error occurred while retrieving the shows';
      if (isAxiosError(error)) {
        if (!searchStringValue && error.status === 404) {
          // The API returns a 404 when we try to retrieve the next page and it doesn't exist
          setHasNextPage(false);
          return; // Don't show error in case of error that there are no other pages
        }
        message = error.message;
      }
      showToast({
        type: 'error',
        text: message,
      });
    },
    [showToast],
  );

  const loadData = useCallback(
    async (pageValue: number, searchStringValue: string) => {
      try {
        setLoading(true);
        if (searchStringValue) {
          const cacheKey = `search/shows?q=${searchStringValue}`;
          let data = await getFromPersistanceStore<Show[]>(
            cacheKey,
            isConnected === true,
          );
          if (!data && isConnected === true) {
            const res = await searchShows(searchStringValue);
            data = res.data.map(item => item.show);
            await setInPersistanceStore(cacheKey, data);
          }
          setShows(data || []);

          if (listRef.current) {
            // Scroll to the top so you can easily see the first matching results
            listRef.current.scrollToOffset({animated: true, offset: 0});
          }
        } else {
          const cacheKey = `shows?page=${pageValue}`;
          let data = await getFromPersistanceStore<Show[]>(
            cacheKey,
            isConnected === true,
          );
          if (!data && isConnected === true) {
            const res = await getShows(pageValue);
            data = res.data;
            await setInPersistanceStore(cacheKey, data);
          }

          if (data) {
            setShows(prevShows => [...prevShows, ...data]);
          } else if (isConnected === false) {
            // When the device is not connected to the Internet, after extracting the data from the cache,
            // we need to stop loading the next pages
            setHasNextPage(false);
          }
        }
        setLoading(false);
      } catch (error) {
        handleError(error, searchStringValue);
      }
    },
    [isConnected, getFromPersistanceStore, setInPersistanceStore, handleError],
  );

  useEffect(() => {
    if (timer) {
      clearTimeout(timer);
    }

    if (!searchString) {
      loadData(page, searchString);
    } else {
      timer = setTimeout(() => {
        loadData(page, searchString);
      }, 500);
    }
  }, [page, searchString, loadData]);

  useEffect(() => {
    if (page === INITIAL_PAGE) {
      setHasNextPage(true);
    }
  }, [page]);

  const handleSearch = (text: string) => {
    setSearchString(text);
    if (!text) {
      setPage(INITIAL_PAGE);
      setShows([]);
    }
  };

  const loadMore = () => {
    const hasDataOnFirstPage = shows.length !== 0;
    // Pagination is not allowed for search endpoint
    if (hasDataOnFirstPage && hasNextPage && !loading && !searchString) {
      setPage(prevPage => prevPage + 1);
    }
  };

  const renderItem: ListRenderItem<Show> = ({item}) => {
    return <ShowsListItem data={item} />;
  };

  return (
    <StackScreenSafeArea>
      <View style={styles.root}>
        <View style={styles.searchContainer}>
          <CustomTextInput
            placeholder="Enter search text"
            value={searchString}
            onChangeText={handleSearch}
          />
        </View>

        <FlatList
          ref={listRef}
          data={shows}
          renderItem={renderItem}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          onEndReached={loadMore}
          ListFooterComponent={loading ? <ActivityIndicator /> : null}
        />
      </View>
    </StackScreenSafeArea>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingLeft: 20,
    paddingRight: 20,
  },
  searchContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  noDataText: {
    textAlign: 'center',
    marginTop: 20,
    color: Colors.black,
  },
  listContainer: {
    flex: 1,
  },
});
