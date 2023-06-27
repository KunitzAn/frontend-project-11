const initRender = (elements) => {
  elements.feedsCard.classList = 'card border-0';
  elements.feedsCardBody.classList = 'card-body';
  elements.feedsCardHeader.classList = 'card-title h4';
  elements.feedsList.classList = 'list-group border-0 rounded-0';
  elements.feedsCard.append(elements.feedsCardBody);
  elements.feedsCardBody.append(elements.feedsCardHeader);
  elements.feedsContainer.append(elements.feedsCard);
  elements.feedsCard.append(elements.feedsList);

  elements.postsCard.classList = 'card border-0';
  elements.postsCardBody.classList = 'card-body';
  elements.postsCardHeader.classList = 'card-title h4';
  elements.postsList.classList = 'list-group border-0 rounded-0';
  elements.postsCard.append(elements.postsCardBody);
  elements.postsCardBody.append(elements.postsCardHeader);
  elements.postsContainer.append(elements.postsCard);
  elements.postsCard.append(elements.postsList);
};
export default initRender;
