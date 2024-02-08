import React from 'react';
import {StyleSheet, TextInput, TextInputProps} from 'react-native';
import {Colors} from '../constants/colors';

export const CustomTextInput = ({style, ...restProps}: TextInputProps) => {
  return (
    <TextInput
      placeholderTextColor={Colors.primary}
      {...restProps}
      style={[styles.input, style]}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    padding: 12,
    borderWidth: 1,
    borderRadius: 6,
    borderColor: Colors.primary,
    color: Colors.primary,
  },
});
