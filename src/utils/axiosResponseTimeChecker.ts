import axios from 'axios';

export const axiosResponseTimeChecker = (
  callback: (milliseconds: number) => void,
) => {
  axios.interceptors.request.use(config => {
    config.headers['request-startTime'] = new Date().getTime();
    return config;
  });

  axios.interceptors.response.use(response => {
    const start = response.config.headers['request-startTime'];
    const end = new Date().getTime();
    const milliseconds = end - start;
    response.headers['request-duration'] = milliseconds;

    callback(milliseconds);

    return response;
  });
};
