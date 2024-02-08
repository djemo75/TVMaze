export type Schedule = {
  time: string;
  days: string[];
};

export type Rating = {
  average: number;
};

export type Country = {
  name: string;
  code: string;
  timezone: string;
};

export type Network = {
  id: number;
  name: string;
  country: Country;
  officialSite: string | null;
};

export type WebChannel = {
  id: string;
  name: string;
  country: Country | null;
  officialSite: string | null;
};

export type Externals = {
  tvrage: number | null;
  thetvdb: number | null;
  imdb: string | null;
};

export type Image = {
  medium: string;
  original: string;
};

export type Link = {
  href: string;
};

export type Links = {
  self: Link;
  previousepisode: Link;
};

export type Show = {
  id: number;
  url: string;
  name: string;
  type: string;
  language: string;
  genres: string[] | null;
  status: string;
  runtime: number | null;
  averageRuntime: number | null;
  premiered: string | null;
  ended: string | null;
  officialSite: string | null;
  schedule: Schedule;
  rating: Rating;
  weight: number;
  network: Network | null;
  webChannel: WebChannel;
  externals: Externals;
  image: Image | null;
  summary: string;
  updated: number;
  _links: Links;
};

export type SearchShowResponse = {
  score: number;
  show: Show;
}[];
