const renderFeeds = (feeds, i18, elements) => {
  const items = feeds.map((feed) => {
    const feedLi = document.createElement('li');
    feedLi.classList = 'list-group-item border-0 border-end-0';
    feedLi.id = feed.id;
    const feedTitle = document.createElement('h3');
    feedTitle.classList = 'h6 m-0';
    feedTitle.textContent = feed.title;
    const feedDescription = document.createElement('p');
    feedDescription.classList = 'm-0 small text-black-50';
    feedDescription.textContent = feed.description;
    feedLi.prepend(feedTitle, feedDescription);
    return feedLi;
  });
  elements.feedsCardHeader.textContent = i18('elements.feeds');
  elements.feedsList.replaceChildren(...items);
};

const renderPosts = (posts, i18, state, elements) => {
  const items = posts.map((post) => {
    const postLi = document.createElement('li');
    postLi.classList = 'list-group-item d-flex justify-content-between align-items-start border-0 border-end-0';

    const postLink = document.createElement('a');
    if (state.uiState.clickedLinksIds.has(post.id)) {
      postLink.classList = 'fw-normal link-secondary';
    } else {
      postLink.classList = 'fw-bold';
    }
    postLink.rel = 'noopener noreferrer';
    postLink.target = '_blank';
    postLink.id = post.id;
    postLink.href = post.link;
    postLink.textContent = post.title;

    const postBtn = document.createElement('button');
    postBtn.textContent = i18('elements.postsBtn');
    postBtn.classList = 'btn btn-outline-primary btn-sm';
    postBtn.type = 'button';
    postBtn.dataset.postId = post.id;
    postBtn.dataset.bsTarget = '#modal';
    postBtn.dataset.bsToggle = 'modal';

    postLi.prepend(postLink, postBtn);
    return postLi;
  });
  elements.postsCardHeader.textContent = i18('elements.posts');
  elements.postsList.replaceChildren(...items);
};

const renderModal = (state) => {
  const selectedPost = state.posts.find(({ id }) => id === state.uiState.watchedPostsIds);
  document.querySelector('.modal-title').textContent = selectedPost.title;
  document.querySelector('.modal-body').textContent = selectedPost.description;
  const modalBtn = document.querySelector('.full-article');
  modalBtn.href = selectedPost.link;
  modalBtn.dataset.linkId = selectedPost.id;
};

const renderLink = (value) => {
  const curLink = document.getElementById([...value].pop());
  curLink.classList = 'fw-normal link-secondary';
};

const renderForm = (state, i18, elements) => {
  switch (state.form.state) {
    case 'success': {
      elements.input.classList.remove('is-invalid');
      elements.input.classList.add('is-valid');
      elements.feedback.classList.remove('text-danger');
      elements.feedback.classList.add('text-success');
      elements.feedback.textContent = i18('loadingStates.successLoading');
      elements.input.value = '';
      elements.input.focus();
      break;
    }
    case 'failed': {
      elements.input.classList.add('is-invalid');
      elements.feedback.classList.add('text-danger');
      break;
    }
    case 'filling': {
      elements.input.classList.remove('is-invalid');
      break;
    }
    default:
  }
};

const render = ({
  path, value, state, i18, elements,
}) => {
  switch (path) {
    case 'feeds': {
      renderFeeds(value, i18, elements);
      break;
    }
    case 'posts': {
      renderPosts(value, i18, state, elements);
      break;
    }
    case 'uiState.watchedPostsIds': {
      renderModal(state);
      break;
    }
    case 'uiState.clickedLinksIds': {
      renderLink(value);
      break;
    }
    ///
    case 'form.state': {
      console.log(state);
      renderForm(state, i18, elements);
      break;
    }
    case 'form.error': {
      elements.feedback.textContent = i18(state.form.error);
      break;
    }
    case 'isLoading': {
      elements.input.disabled = state.isLoading;
      elements.addBtn.disabled = state.isLoading;
      break;
    }
    default:
  }
};

export default render;
