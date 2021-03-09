import axios from 'axios';
import Filter from 'bad-words';

export interface IPhoto {
  id: number;
  owner: string;
  secret: string;
  server: number;
  title: string;
  farm: number
  ispublic: boolean;
  isfriend: boolean;
  isfamily: boolean;
  ownername: string;
  tags: string;
  description: { _content: string }
}

export interface IPhotoResponse {
  page: number;
  pages: number;
  perpage: number;
  total: number;
  photo: IPhoto[]
}

export interface IFlickrResponse {
  photos: IPhotoResponse;
  stat: string;
}

const filter = new Filter();
const API_URL = 'https://api.flickr.com/services/rest/';

const DEFAULT_PARAMS = {
  // key not safe to store it like this. Needs to be hidden to external users
  api_key: "0bfc09850b8b3f9728d35e1cb15915b3",
  safe_search: 1,
  per_page: 20,
  format: 'json',
  nojsoncallback: 1,
  extras: 'owner_name,description,tags'
};

/**
 * Returns Flickr photo URL based on the photo's ID and CDN attributes.
 * @param {IPhoto} photo Flickr photo object
 * @return String Photo URL
 */
export const getPhotoURL = (photo: IPhoto) => {
  return `https://live.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_q.jpg`;
}

/**
 * Returns Flickr photo URL for the author, based on the photo's ID and CDN attributes.
 * @param {IPhoto} photo Flickr photo object
 * @return String Author URL
 */
export const getAuthorURL = (photo: IPhoto) => {
  return `https://www.flickr.com/people/${photo.owner}/`;
}

/**
 * Returns latest photos from public Flickr feed.
 * @param {string} [tags] Tags to filter by.
 * @return Promise
 */
export const fetchPhotos = async (tags: string = '') => {
  // Search does not support parameter less searching, in which case we fall back to getRecent.
  const method = !!tags
    ? 'flickr.photos.search'
    : 'flickr.photos.getRecent'

  const params = {
    ...DEFAULT_PARAMS,
    method,
    tags
  };

  return axios
    .get(API_URL, { params })
    .then(({ data }) => {

      if (data.stat === 'fail' || !data.photos) {
        throw new Error('Flickr request failed.');
      }

      // filtering out photos that might be NSFW. 
      // The "safe" flag is set by the user and not entirely reliable.
      // also doesn't seem to be a safe flag on getRecent call
      let feed: IFlickrResponse = data || [];
      feed.photos.photo = feed.photos.photo.filter((item) => !filter.isProfane(item.title));

      return feed
    });
};