import React, {useCallback, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  ListRenderItem,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {searchShows} from '../../services/show';
import {CustomTextInput} from '../../components/CustomTextInput';
import {Show} from '../../types/show';
import {ShowsListItem} from '../../components/ShowsListItem';
import {useToast} from '../../context/toastContext';
import {isAxiosError} from 'axios';
import {Colors} from '../../constants/colors';

let timer: NodeJS.Timeout;

export const HomeScreen = () => {
  const {showToast} = useToast();
  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchString, setSearchString] = useState<string>('');

  const loadData = useCallback(
    async (searchStringValue: string) => {
      try {
        setLoading(true);
        const {data} = await searchShows(searchStringValue);
        setShows(data.map(item => item.show));
      } catch (error) {
        let message = 'An error occurred while retrieving the data';
        if (isAxiosError(error)) {
          console.log('err', JSON.stringify(error));
          message = error.message;
        }
        showToast({
          type: 'error',
          text: message,
        });
      } finally {
        setLoading(false);
      }
    },
    [showToast],
  );

  useEffect(() => {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      loadData(searchString);
    }, 300);
  }, [searchString, loadData]);

  const renderItem: ListRenderItem<Show> = ({item}) => {
    return <ShowsListItem data={item} />;
  };

  return (
    <View style={styles.root}>
      <View style={styles.searchContainer}>
        <CustomTextInput
          placeholder="Enter search text"
          value={searchString}
          onChangeText={setSearchString}
        />
      </View>

      {!searchString && shows.length === 0 && (
        <Text style={styles.noDataText}>
          Type the name of the series you want to find
        </Text>
      )}

      {loading ? (
        <ActivityIndicator />
      ) : (
        <FlatList
          data={shows}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
        />
      )}
    </View>
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
