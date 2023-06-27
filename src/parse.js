const parse = (data) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(data, 'text/xml').documentElement;
  if (doc.querySelector('parsererror')) {
    throw new Error('loadingStates.parserError');
  }
  const posts = doc.querySelectorAll('item');

  return {
    feed: {
      title: doc.querySelector('channel title').textContent,
      description: doc.querySelector('channel description').textContent,
    },
    posts: [...posts].map((post) => ({
      title: post.querySelector('title').textContent,
      link: post.querySelector('link').textContent,
      description: post.querySelector('description').textContent,
    })),
  };
};

export default parse;
