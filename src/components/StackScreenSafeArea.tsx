import React, {FC, PropsWithChildren} from 'react';
import {StyleSheet, View} from 'react-native';

import {useSafeAreaInsets} from 'react-native-safe-area-context';

export const StackScreenSafeArea: FC<PropsWithChildren> = ({children}) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.root, {marginBottom: insets.bottom}]}>{children}</View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
