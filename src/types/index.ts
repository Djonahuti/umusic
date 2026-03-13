export type User = {
    id: string;
    email: string;
    fullName: string;
    is_admin: boolean;
    avatar_url?: string;
};

interface Album {
  id: string;
  name: string;
  info: string;
  cover_url: string;
  artists: {
    name: string;
  };
}

interface Song {
  id: string;
  title: string;
  album_id: string;
  duration: number; // duration in seconds
}

export type { Album, Song };