import {useEffect, useRef} from 'react';
import {axiosResponseTimeChecker} from '../utils/axiosResponseTimeChecker';
import {useToast} from '../context/toastContext';

const millisecondsForBadConnection = 3000;
const message = 'Bad connection';

export const BadInternetConnectionNotifier = () => {
  const {toasts, showToast} = useToast();
  const hasBadConnectionToast = useRef<boolean>(false);

  useEffect(() => {
    axiosResponseTimeChecker(milliseconds => {
      if (
        !hasBadConnectionToast.current &&
        milliseconds > millisecondsForBadConnection
      ) {
        showToast({type: 'info', text: message});
        hasBadConnectionToast.current = true;
      }
    });
  }, [showToast]);

  useEffect(() => {
    if (!toasts.find(toast => toast.text === message)) {
      hasBadConnectionToast.current = false;
    }
  }, [toasts]);

  return null;
};
