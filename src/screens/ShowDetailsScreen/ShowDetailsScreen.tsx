import {
  NavigationProp,
  RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import React, {useCallback, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Image,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {RootStackParamList} from '../../../App';
import {Show} from '../../types/show';
import {getShowDetails} from '../../services/show';
import {Colors} from '../../constants/colors';
import {removeHtmlFromString} from '../../utils/removeHtmlFromString';
import {useToast} from '../../context/toastContext';
import {isAxiosError} from 'axios';

export const ShowDetailsScreen = () => {
  const route = useRoute<RouteProp<RootStackParamList>>();
  const navigate = useNavigation<NavigationProp<RootStackParamList>>();
  const {showToast} = useToast();
  const [details, setDetails] = useState<Show>();
  const [loading, setLoading] = useState<boolean>();

  const loadData = useCallback(async () => {
    if (!route.params || !route.params.id) {
      navigate.navigate('home');
      return;
    }
    try {
      setLoading(true);
      const {data} = await getShowDetails(route.params.id);
      setDetails(data);
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
  }, [route.params, navigate, showToast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleClickMoreInfo = () => {
    if (details) {
      Linking.openURL(details.url);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
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
            {removeHtmlFromString(details.summary)}
          </Text>

          {details.url && (
            <Pressable
              onPress={handleClickMoreInfo}
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