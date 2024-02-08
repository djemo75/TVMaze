import React, {
  FC,
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useState,
} from 'react';
import {StyleSheet, View} from 'react-native';
import {Toast} from '../types/toast';
import {ToastItem} from '../components/ToastItem';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

type ContextState = {
  toasts: Toast[];
};

const initialValues: ContextState = {
  toasts: [],
};

type ContextActions = {
  showToast: (toast: Omit<Toast, 'id'>) => Toast;
  hideToast: (toastId: Toast['id']) => void;
};

type Context = ContextState & ContextActions;

export const ToastContext = createContext<Context>(initialValues as Context);

export const ToastContextProvider: FC<PropsWithChildren> = ({children}) => {
  const insets = useSafeAreaInsets();
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((data: Omit<Toast, 'id'>) => {
    const newToast: Toast = {
      id: new Date().getTime().toString(),
      ...data,
    };

    setToasts(prevState => [...prevState, newToast]);

    return newToast;
  }, []);

  const hideToast = useCallback((toastId: Toast['id']) => {
    setToasts(prevToasts => prevToasts.filter(toast => toast.id !== toastId));
  }, []);

  return (
    <ToastContext.Provider
      value={{
        toasts,
        showToast,
        hideToast,
      }}>
      <View style={styles.root}>
        {children}

        <View style={(styles.toastsContainer, {bottom: insets.bottom})}>
          {toasts.map(toast => (
            <ToastItem key={toast.id} data={toast} />
          ))}
        </View>
      </View>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  toastsContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
});
