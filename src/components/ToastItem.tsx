import React, {useEffect} from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {Colors} from '../constants/colors';
import {useToast} from '../context/toastContext';
import {Toast} from '../types/toast';

type Props = {
  data: Toast;
};

export const ToastItem = ({data}: Props) => {
  const {hideToast} = useToast();

  useEffect(() => {
    setTimeout(() => {
      hideToast(data.id);
    }, 4000);
  }, [data.id, hideToast]);

  return (
    <View style={[style.root, style[`${data.type}Type`]]}>
      <Text style={style.toastText}>{data.text}</Text>
    </View>
  );
};

const style = StyleSheet.create({
  root: {
    padding: 8,
    marginLeft: 20,
    marginRight: 20,
    borderRadius: 8,
    marginTop: 12,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  infoType: {backgroundColor: '#28333b'},
  errorType: {backgroundColor: '#ff1a4b'},
  toastText: {
    color: Colors.white,
  },
});
