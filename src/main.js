// зависимости
import onChange from 'on-change';
import * as yup from 'yup';
import { setLocale } from 'yup';
import i18n from 'i18next';
import { uniqBy, uniqueId } from 'lodash';

// модули
import resources from './locales/ru';
import initRender from './initRender';
import render from './render';
import parse from './parse';
import getFeed from './getFeed';

const elements = {
  form: document.querySelector('form'),
  addBtn: document.querySelector('form button'),
  input: document.getElementById('url-input'),
  feedback: document.querySelector('.feedback'),
  feedsContainer: document.querySelector('.feeds'),
  postsContainer: document.querySelector('.posts'),
  feedsCard: document.createElement('div'),
  feedsCardBody: document.createElement('div'),
  feedsCardHeader: document.createElement('h2'),
  feedsList: document.createElement('ul'),
  postsCard: document.createElement('div'),
  postsCardBody: document.createElement('div'),
  postsCardHeader: document.createElement('h2'),
  postsList: document.createElement('ul'),
  modal: document.getElementById('modal'),

  /* было это вместо части выше
  feedsCard: document.createElement('div'),
  feedsCardBody: document.createElement('div'),
  feedsCardTitle: document.createElement('h2'),
  feedsListGroup: document.createElement('ul'),
  postsCard: document.createElement('div'),
  postsCardBody: document.createElement('div'),
  postsCardTitle: document.createElement('h2'),
  postsListGroup: document.createElement('ul'),
  modal: document.getElementById('modal'), */
};

const timeout = 5000;

const app = () => {
  const defaultLanguage = 'ru';
  const newi18nInstance = i18n.createInstance();
  return newi18nInstance.init({
    lng: defaultLanguage,
    debug: false,
    resources,
  }).then((i18) => {
    initRender(elements);

    const state = {
      isLoading: false,
      form: {
        state: 'filling',
        error: null,
      },
      feeds: [],
      posts: [],
      uiState: {
        clickedLinksIds: new Set(),
        watchedPostsIds: null,
      },
    };

    setLocale({
      mixed: {
        notOneOf: 'loadingStates.urlExists',
      },
      string: {
        url: 'loadingStates.notValidUrl',
      },
    });

    const watchedState = onChange(state, (path, value) => {
      render({
        path, value, state, i18, elements,
      });
    });

    elements.input.addEventListener('input', () => {
      if (watchedState.form.error) {
        watchedState.form.error = null;
        watchedState.form.state = 'filling';
      }
    });

    elements.postsList.addEventListener('click', (e) => {
      if (e.target.tagName === 'BUTTON') {
        const { postId } = e.target.dataset;
        watchedState.uiState.watchedPostsIds = postId;
        watchedState.uiState.clickedLinksIds.add(postId);
      }
      if (e.target.tagName === 'A') {
        watchedState.uiState.clickedLinksIds.add(e.target.id);
      }
    });

    const validate = (field) => yup.string().trim().required().url()
      .notOneOf(watchedState.feeds.map((feed) => feed.link))
      .validate(field);

    const loadPosts = (url) => {
      getFeed(url)
        .then((result) => {
          console.log(result.data);
          if (result.error) {
            throw new Error(result.error);
          }
          const parsedResult = parse(result.data);

          const newFeed = {
            ...parsedResult.feed,
            id: uniqueId('feed'),
            link: url,
          };
          const newPosts = parsedResult.posts.map((post) => ({
            ...post,
            id: uniqueId('post'),
          }));

          watchedState.feeds.push(newFeed);
          watchedState.posts = uniqBy([...watchedState.posts, ...newPosts], 'link');
          watchedState.isLoading = false;
          watchedState.form.state = 'success';
        })
        .catch((err) => {
          watchedState.isLoading = false;
          watchedState.form.state = 'failed';
          watchedState.form.error = err.message;
        });
    };

    const updatePosts = () => {
      const promises = watchedState.feeds.map((feed) => getFeed(feed.link)
        .then((result) => {
          if (result.error) {
            throw new Error(result.error);
          }
          const parsedResult = parse(result.data);

          const newPosts = parsedResult.posts.map((post) => ({
            ...post,
            id: uniqueId('post'),
          }));

          watchedState.posts = uniqBy([...watchedState.posts, ...newPosts], 'link');
        })
        .catch((err) => {
          console.error(err);
        }));
      Promise.all(promises)
        .then(setTimeout(() => updatePosts(), timeout));
    };

    elements.form.addEventListener('submit', (e) => { // event при субмите формы
      e.preventDefault();
      watchedState.form.error = null;
      const formData = new FormData(e.target);
      const url = formData.get('url');

      validate(url)
        .then((validUrl) => {
          watchedState.isLoading = true;
          loadPosts(validUrl);
        })
        .catch((err) => {
          watchedState.form.state = 'failed';
          watchedState.form.error = err.errors.pop();
        });
    });

    setTimeout(() => updatePosts(), timeout);
  });
};

export default app;
