import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  ListRenderItem,
  StyleSheet,
  View,
} from 'react-native';

import {getShows, searchShows} from '../../services/show';
import {CustomTextInput} from '../../components/CustomTextInput';
import {Show} from '../../types/show';
import {ShowsListItem} from '../../components/ShowsListItem';
import {useToast} from '../../context/toastContext';
import {isAxiosError} from 'axios';
import {Colors} from '../../constants/colors';
import {StackScreenSafeArea} from '../../components/StackScreenSafeArea';

let timer: NodeJS.Timeout;

const INITIAL_PAGE = 1;

export const HomeScreen = () => {
  const {showToast} = useToast();
  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchString, setSearchString] = useState<string>('');
  const [page, setPage] = useState<number>(INITIAL_PAGE);
  const [hasNextPage, setHasNextPage] = useState(true);
  const listRef = useRef<FlatList>(null);

  const loadData = useCallback(
    async (pageValue: number, searchStringValue: string) => {
      try {
        setLoading(true);
        if (searchStringValue) {
          const {data} = await searchShows(searchStringValue);
          setShows(data.map(item => item.show));
          if (listRef.current) {
            // Scroll to the top so you can easily see the first matching results
            listRef.current.scrollToOffset({animated: true, offset: 0});
          }
        } else {
          const {data} = await getShows(pageValue);
          setShows(prevShows => [...prevShows, ...data]);
        }
        setLoading(false);
      } catch (error) {
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
      }
    },
    [showToast],
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
