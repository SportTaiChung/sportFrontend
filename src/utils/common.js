const resSrc = (url) => {
  if (process.env.NODE_ENV === 'development') {
    if (url.startsWith('/resources/')) {
      return process.env.VUE_APP_DEV_DOMAIN + url;
    } else {
      return url;
    }
  } else {
    return url;
  }
};

export default {
  resSrc,
};
