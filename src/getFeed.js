import axios from 'axios';

const getFeed = (url) => {
  const curUrl = new URL('/get', 'https://allorigins.hexlet.app');
  curUrl.searchParams.append('url', url);
  curUrl.searchParams.append('disableCache', true);

  return axios.get(curUrl)
    .then((response) => ({ data: response.data.contents }))
    .catch((err) => {
      if (err.response) {
        return { error: 'loadingStates.responseErr' };
      } if (err.request) {
        return { error: 'loadingStates.networkError' };
      }
      return { error: 'loadingStates.commonErr' };
    });
};

export default getFeed;
