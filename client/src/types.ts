export interface OmdbMovie {
  imdbID: string;
  Title: string;
  Year: string;
  Poster: string;
  Watched?: boolean;
}

export interface WatchlistMovie {
  _id?: string;
  movieId: string;
  title: string;
  year: string;
  posterPath: string;
  watched?: boolean;
}
