import axios from 'axios';
import {SearchShowResponse, Show} from '../types/show';
import {REACT_APP_TV_MAZE_API_URL} from '@env';

export const searchShows = async (searchString: string) => {
  return axios.get<SearchShowResponse>(
    `${REACT_APP_TV_MAZE_API_URL}/search/shows?q=${searchString}`,
  );
};

export const getShows = async (page: number) => {
  return axios.get<Show[]>(`${REACT_APP_TV_MAZE_API_URL}/shows?page=${page}`);
};

export const getShowDetails = async (id: string) => {
  return axios.get<Show>(`${REACT_APP_TV_MAZE_API_URL}/shows/${id}`);
};
