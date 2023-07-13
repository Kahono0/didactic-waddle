var webpack = require('webpack');

module.exports = function override(config, env) {

  const fallback = config.resolve.fallback || {};
  Object.assign(fallback, {
    crypto: require.resolve('crypto-browserify'),
    stream: require.resolve('stream-browserify'),
    assert: require.resolve('assert'),
    http: require.resolve('stream-http'),
    https: require.resolve('https-browserify'),
    os: require.resolve('os-browserify'),
    path: require.resolve('path-browserify'),
    process: require.resolve("process"),
    url: require.resolve('url'),
    zlib: require.resolve("browserify-zlib")

  });
  config.resolve.fallback = fallback;

  // config.plugins.push(new webpack.DefinePlugin({
  //  'process.env': {
  //    NODE_ENV: JSON.stringify(process.env.NODE_ENV)
  //  }
  //}));

  return config;
}
