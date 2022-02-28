module.exports = {
  webpackDevMiddleware: (config) => {
    // semi-fix file change detection when running in docker container
    config.watchOptions.poll = 300;
    return config;
  },
};
